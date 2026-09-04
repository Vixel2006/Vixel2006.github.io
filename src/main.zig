const std = @import("std");
const Io = std.Io;
const fs = std.Io.Dir;
const mem = std.mem;
const Allocator = std.mem.Allocator;

const Post = struct {
    title: []const u8,
    date: []const u8,
    description: []const u8,
    tags: std.ArrayList([]const u8),
    slug: []const u8,
    body_md: []const u8,
    body_html: []const u8,
};

const site_name = "VIXEL";
const site_url = "https://vixel2006.github.io/blog";
const site_description = "machines, systems, ideas";
const site_author = "Vixel";

var g_note_id: usize = 0;

pub fn main() !void {
    const alloc = std.heap.page_allocator;
    var threaded = Io.Threaded.init(alloc, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // create output dir
    const cwd = fs.cwd();
    _ = cwd.createDirPath(io, "site") catch |e| switch (e) {
        error.PathAlreadyExists => {},
        else => return e,
    };
    _ = cwd.createDirPath(io, "site/posts") catch |e| switch (e) {
        error.PathAlreadyExists => {},
        else => return e,
    };

    var posts = std.ArrayList(Post).empty;
    defer for (posts.items) |*p| p.tags.deinit(alloc);

    var posts_dir = cwd.openDir(io, "posts", .{ .iterate = true }) catch |e| {
        std.debug.print("error opening posts/: {}\n", .{e});
        return e;
    };
    defer posts_dir.close(io);

    var iter = posts_dir.iterate();
    while (try iter.next(io)) |entry| {
        if (entry.kind != .file) continue;
        if (!mem.endsWith(u8, entry.name, ".md")) continue;

        const content = try posts_dir.readFileAlloc(io, entry.name, alloc, .limited(1024 * 1024));
        defer alloc.free(content);

        const slug = try alloc.dupe(u8, entry.name[0 .. entry.name.len - 3]);

        var post = try parsePost(alloc, content, slug);
        post.body_html = try renderMarkdown(alloc, post.body_md);
        try posts.append(alloc, post);
    }

    std.mem.sort(Post, posts.items, {}, struct {
        fn lessThan(_: void, a: Post, b: Post) bool {
            return mem.order(u8, a.date, b.date) == .gt;
        }
    }.lessThan);

    try generateIndex(alloc, posts.items, io, cwd);
    try generatePostPages(alloc, posts.items, io, cwd);
    try generateProjectsPage(alloc, io, cwd);
    try generateRSS(alloc, posts.items, io, cwd);

    try copyFile(io, cwd, "assets/site.css", "site/site.css");
    try copyFile(io, cwd, "assets/hljs-catppuccin.css", "site/hljs-catppuccin.css");
    try copyFile(io, cwd, "assets/highlight.min.js", "site/highlight.min.js");
    try copyFile(io, cwd, "assets/hljs-langs.js", "site/hljs-langs.js");
    try copyFile(io, cwd, "assets/ascii-ansi-shadow-1787844086988.png", "site/favicon.png");

    std.debug.print("built {d} pages to site/\n", .{posts.items.len + 2});
}

fn copyFile(io: Io, cwd: fs, src: []const u8, dst: []const u8) !void {
    const content = try cwd.readFileAlloc(io, src, std.heap.page_allocator, .limited(1024 * 1024));
    defer std.heap.page_allocator.free(content);
    const f = try cwd.createFile(io, dst, .{});
    defer f.close(io);
    try f.writePositionalAll(io, content, 0);
}

fn parsePost(alloc: Allocator, content: []const u8, slug: []const u8) !Post {
    if (!mem.startsWith(u8, content, "{\n")) return error.InvalidFrontmatter;

    const sep = mem.indexOf(u8, content, "}\n---\n") orelse return error.InvalidFrontmatter;
    const body_start = sep + 6; // skip over "}\n---\n"
    const frontmatter = content[0 .. sep + 1]; // includes }
    const body = if (body_start < content.len) content[body_start..] else "";

    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, alloc, frontmatter, .{});
    const obj = parsed.object;

    const title = obj.get("title").?.string;
    const date = obj.get("date").?.string;
    const description = if (obj.get("description")) |d| d.string else "";
    var tags = std.ArrayList([]const u8).empty;
    if (obj.get("tags")) |t| {
        for (t.array.items) |tag| {
            try tags.append(alloc, tag.string);
        }
    }

    return Post{
        .title = title,
        .date = date,
        .description = description,
        .tags = tags,
        .slug = slug,
        .body_md = body,
        .body_html = "",
    };
}

// ---------------------------------------------------------------------------
// Markdown -> HTML
// ---------------------------------------------------------------------------

fn renderMarkdown(alloc: Allocator, md: []const u8) ![]const u8 {
    var out = std.ArrayList(u8).empty;
    errdefer out.deinit(alloc);

    var lines = std.ArrayList([]const u8).empty;
    defer lines.deinit(alloc);
    var it = mem.splitScalar(u8, md, '\n');
    while (it.next()) |l| {
        try lines.append(alloc, mem.trimEnd(u8, l, "\r"));
    }

    var in_code_block = false;
    var in_list = false;
    var list_is_ordered = false;
    var list_counter: usize = 0;
    var in_blockquote = false;

    var i: usize = 0;
    while (i < lines.items.len) : (i += 1) {
        const line = lines.items[i];
        const trimmed = mem.trim(u8, line, " ");

        if (mem.startsWith(u8, line, "```")) {
            if (!in_code_block) {
                in_code_block = true;
                const code_lang = mem.trim(u8, line[3..], " ");
                try closeList(alloc, &out, &in_list, list_is_ordered);
                try closeBlockquote(alloc, &out, &in_blockquote);
                if (code_lang.len > 0) {
                    try out.appendSlice(alloc, "<pre><code class=\"language-");
                    try out.appendSlice(alloc, code_lang);
                    try out.appendSlice(alloc, "\">");
                } else {
                    try out.appendSlice(alloc, "<pre><code>");
                }
            } else {
                in_code_block = false;
                try out.appendSlice(alloc, "</code></pre>\n");
            }
            continue;
        }

        if (in_code_block) {
            try escapeHtml(alloc, &out, line);
            _ = try out.append(alloc, '\n');
            continue;
        }

        if (trimmed.len == 0) {
            try closeList(alloc, &out, &in_list, list_is_ordered);
            try closeBlockquote(alloc, &out, &in_blockquote);
            continue;
        }

        if (mem.eql(u8, trimmed, "---") or mem.eql(u8, trimmed, "***") or mem.eql(u8, trimmed, "___")) {
            try closeList(alloc, &out, &in_list, list_is_ordered);
            try closeBlockquote(alloc, &out, &in_blockquote);
            try out.appendSlice(alloc, "<hr>\n");
            continue;
        }

        // Pipe table: header row followed by a separator row.
        if (mem.indexOfScalar(u8, line, '|') != null and i + 1 < lines.items.len) {
            if (try renderTable(alloc, &out, lines.items, i)) |consumed| {
                try closeList(alloc, &out, &in_list, list_is_ordered);
                try closeBlockquote(alloc, &out, &in_blockquote);
                i += consumed - 1;
                continue;
            }
        }

        // Standalone image line: ![alt](url ...) on its own → block-level figure.
        if (mem.startsWith(u8, trimmed, "![")) {
            if (try renderBlockImage(alloc, &out, trimmed)) {
                try closeList(alloc, &out, &in_list, list_is_ordered);
                try closeBlockquote(alloc, &out, &in_blockquote);
                continue;
            }
        }

        if (mem.startsWith(u8, trimmed, "# ")) {
            try closeList(alloc, &out, &in_list, list_is_ordered);
            try closeBlockquote(alloc, &out, &in_blockquote);
            try renderHeading(alloc, &out, "1", trimmed[2..]);
            continue;
        }
        if (mem.startsWith(u8, trimmed, "## ")) {
            try closeList(alloc, &out, &in_list, list_is_ordered);
            try closeBlockquote(alloc, &out, &in_blockquote);
            try renderHeading(alloc, &out, "2", trimmed[3..]);
            continue;
        }
        if (mem.startsWith(u8, trimmed, "### ")) {
            try closeList(alloc, &out, &in_list, list_is_ordered);
            try closeBlockquote(alloc, &out, &in_blockquote);
            try renderHeading(alloc, &out, "3", trimmed[4..]);
            continue;
        }

        if (mem.startsWith(u8, trimmed, "> ")) {
            if (!in_blockquote) {
                try closeList(alloc, &out, &in_list, list_is_ordered);
                try out.appendSlice(alloc, "<blockquote>\n");
                in_blockquote = true;
            }
            try out.appendSlice(alloc, "<p>");
            try renderInline(alloc, &out, trimmed[2..]);
            try out.appendSlice(alloc, "</p>\n");
            continue;
        }
        if (in_blockquote and !mem.startsWith(u8, trimmed, ">")) {
            try closeList(alloc, &out, &in_list, list_is_ordered);
            in_blockquote = false;
        }

        if (mem.startsWith(u8, trimmed, "- ")) {
            try closeBlockquote(alloc, &out, &in_blockquote);
            if (!in_list or list_is_ordered) {
                if (in_list) try out.appendSlice(alloc, "</ol>\n");
                try out.appendSlice(alloc, "<ul>\n");
                in_list = true;
                list_is_ordered = false;
            }
            try out.appendSlice(alloc, "<li>");
            try renderInline(alloc, &out, trimmed[2..]);
            try out.appendSlice(alloc, "</li>\n");
            continue;
        }

        if (trimmed.len > 2 and trimmed[0] >= '0' and trimmed[0] <= '9') {
            var dot_pos: usize = 0;
            while (dot_pos < trimmed.len and trimmed[dot_pos] != '.') : (dot_pos += 1) {}
            if (dot_pos < trimmed.len and dot_pos > 0 and trimmed[dot_pos] == '.') {
                const rest = mem.trim(u8, trimmed[dot_pos + 1 ..], " ");
                if (rest.len > 0) {
                    try closeBlockquote(alloc, &out, &in_blockquote);
                    if (!in_list or !list_is_ordered) {
                        if (in_list) try out.appendSlice(alloc, "</ul>\n");
                        try out.appendSlice(alloc, "<ol>\n");
                        in_list = true;
                        list_is_ordered = true;
                        list_counter = 0;
                    }
                    list_counter += 1;
                    try out.print(alloc, "<li value=\"{d}\">", .{list_counter});
                    try renderInline(alloc, &out, rest);
                    try out.appendSlice(alloc, "</li>\n");
                    continue;
                }
            }
        }

        if (in_list) {
            try out.appendSlice(alloc, if (list_is_ordered) "</ol>\n" else "</ul>\n");
            in_list = false;
        }

        try out.appendSlice(alloc, "<p>");
        try renderInline(alloc, &out, trimmed);
        try out.appendSlice(alloc, "</p>\n");
    }

    try closeList(alloc, &out, &in_list, list_is_ordered);
    try closeBlockquote(alloc, &out, &in_blockquote);

    return try out.toOwnedSlice(alloc);
}

fn renderTable(alloc: Allocator, out: *std.ArrayList(u8), lines: []const []const u8, start: usize) !?usize {
    // First line must be a header with cells; second must parse as a separator.
    var header_cells = std.ArrayList([]const u8).empty;
    defer header_cells.deinit(alloc);
    try splitPipes(alloc, &header_cells, lines[start]);
    if (header_cells.items.len == 0) return null;

    var sep_cells = std.ArrayList([]const u8).empty;
    defer sep_cells.deinit(alloc);
    try splitPipes(alloc, &sep_cells, lines[start + 1]);
    if (sep_cells.items.len != header_cells.items.len) return null;
    for (sep_cells.items) |cell| {
        if (!isSeparatorCell(cell)) return null;
    }

    var aligns = std.ArrayList([]const u8).empty; // "l", "r", "c", ""
    defer aligns.deinit(alloc);
    for (sep_cells.items) |cell| {
        const c = mem.trim(u8, cell, " ");
        var al: []const u8 = "";
        if (mem.startsWith(u8, c, ":") and mem.endsWith(u8, c, ":")) {
            al = "c";
        } else if (mem.endsWith(u8, c, ":")) {
            al = "r";
        } else if (mem.startsWith(u8, c, ":")) {
            al = "l";
        }
        try aligns.append(alloc, al);
    }

    try out.appendSlice(alloc, "<table>\n<thead>\n<tr>\n");
    for (header_cells.items, 0..) |cell, idx| {
        try out.appendSlice(alloc, "<th");
        try appendAlign(alloc, out, aligns.items[idx]);
        try out.appendSlice(alloc, ">");
        try renderInline(alloc, out, mem.trim(u8, cell, " "));
        try out.appendSlice(alloc, "</th>\n");
    }
    try out.appendSlice(alloc, "</tr>\n</thead>\n<tbody>\n");

    var i = start + 2;
    while (i < lines.len) : (i += 1) {
        const line = lines[i];
        const t = mem.trim(u8, line, " ");
        if (t.len == 0) break;
        if (mem.indexOfScalar(u8, line, '|') == null and mem.indexOfScalar(u8, t, '|') == null) break;

        var cells = std.ArrayList([]const u8).empty;
        defer cells.deinit(alloc);
        try splitPipes(alloc, &cells, line);
        if (cells.items.len == 0) break;

        try out.appendSlice(alloc, "<tr>\n");
        for (cells.items, 0..) |cell, idx| {
            try out.appendSlice(alloc, "<td");
            if (idx < aligns.items.len) try appendAlign(alloc, out, aligns.items[idx]);
            try out.appendSlice(alloc, ">");
            try renderInline(alloc, out, mem.trim(u8, cell, " "));
            try out.appendSlice(alloc, "</td>\n");
        }
        try out.appendSlice(alloc, "</tr>\n");
    }

    try out.appendSlice(alloc, "</tbody>\n</table>\n");
    return i - start;
}

fn appendAlign(alloc: Allocator, out: *std.ArrayList(u8), al: []const u8) !void {
    if (mem.eql(u8, al, "l")) {
        try out.appendSlice(alloc, " style=\"text-align:left\"");
    } else if (mem.eql(u8, al, "r")) {
        try out.appendSlice(alloc, " style=\"text-align:right\"");
    } else if (mem.eql(u8, al, "c")) {
        try out.appendSlice(alloc, " style=\"text-align:center\"");
    }
}

fn isSeparatorCell(cell: []const u8) bool {
    const c = mem.trim(u8, cell, " ");
    if (c.len == 0) return false;
    var body = c;
    if (mem.startsWith(u8, body, ":")) body = body[1..];
    if (mem.endsWith(u8, body, ":")) body = body[0 .. body.len - 1];
    if (body.len == 0) return false;
    for (body) |ch| {
        if (ch != '-') return false;
    }
    return true;
}

fn splitPipes(alloc: Allocator, segs: *std.ArrayList([]const u8), line: []const u8) !void {
    segs.clearRetainingCapacity();
    var start: usize = 0;
    var i: usize = 0;
    while (i < line.len) : (i += 1) {
        if (line[i] == '\\' and i + 1 < line.len and line[i + 1] == '|') {
            i += 1;
            continue;
        }
        if (line[i] == '|') {
            const seg = mem.trim(u8, line[start..i], " ");
            if (seg.len > 0) try segs.append(alloc, seg);
            start = i + 1;
        }
    }
    const last = mem.trim(u8, line[start..], " ");
    if (last.len > 0) try segs.append(alloc, last);
}

// Renders a standalone image line as a block-level <figure>. Returns true if
// the whole line was a single image (nothing else before/after it).
fn renderBlockImage(alloc: Allocator, out: *std.ArrayList(u8), line: []const u8) !bool {
    if (!mem.startsWith(u8, line, "![")) return false;
    const close = mem.indexOf(u8, line[2..], "]") orelse return false;
    const paren = 2 + close + 1;
    if (paren >= line.len or line[paren] != '(') return false;
    const url_end = mem.indexOf(u8, line[paren + 1 ..], ")") orelse return false;
    const after = mem.trim(u8, line[paren + 1 + url_end + 1 ..], " ");
    if (after.len != 0) return false;

    const alt = line[2 .. 2 + close];
    const dest = line[paren + 1 .. paren + 1 + url_end];

    var url = dest;
    var caption: []const u8 = "";
    var width: []const u8 = "";
    if (mem.indexOfAny(u8, dest, " \"")) |s| {
        url = dest[0..s];
    }
    if (mem.indexOfScalar(u8, dest, '"')) |q| {
        if (mem.lastIndexOfScalar(u8, dest, '"')) |q2| {
            if (q2 > q) caption = dest[q + 1 .. q2];
        }
    }
    if (mem.indexOfScalar(u8, dest, '=')) |eq| {
        const w = mem.trim(u8, dest[eq + 1 ..], " ");
        if (w.len > 0) width = w;
    }

    try out.appendSlice(alloc, "<figure class=\"img\">\n<img src=\"");
    try out.appendSlice(alloc, url);
    try out.appendSlice(alloc, "\" alt=\"");
    try escapeHtml(alloc, out, alt);
    try out.appendSlice(alloc, "\" loading=\"lazy\"");
    if (width.len > 0) {
        try out.print(alloc, " width=\"{s}\"", .{width});
    }
    try out.appendSlice(alloc, ">\n");
    if (caption.len > 0) {
        try out.appendSlice(alloc, "<figcaption>");
        try renderInline(alloc, out, mem.trim(u8, caption, " "));
        try out.appendSlice(alloc, "</figcaption>\n");
    }
    try out.appendSlice(alloc, "</figure>\n");
    return true;
}

fn closeList(alloc: Allocator, out: *std.ArrayList(u8), in_list: *bool, list_is_ordered: bool) !void {
    if (in_list.*) {
        try out.appendSlice(alloc, if (list_is_ordered) "</ol>\n" else "</ul>\n");
        in_list.* = false;
    }
}

fn closeBlockquote(alloc: Allocator, out: *std.ArrayList(u8), in_blockquote: *bool) !void {
    if (in_blockquote.*) {
        try out.appendSlice(alloc, "</blockquote>\n");
        in_blockquote.* = false;
    }
}

fn slugify(alloc: Allocator, src: []const u8) ![]const u8 {
    var out = std.ArrayList(u8).empty;
    var last_was_dash = true;
    for (src) |c| {
        const b: u8 = switch (c) {
            'A'...'Z' => c + 32,
            'a'...'z', '0'...'9' => c,
            else => 0,
        };
        if (b != 0) {
            try out.append(alloc, b);
            last_was_dash = false;
        } else if (!last_was_dash) {
            try out.append(alloc, '-');
            last_was_dash = true;
        }
    }
    if (out.items.len > 0 and out.items[out.items.len - 1] == '-') {
        out.shrinkRetainingCapacity(out.items.len - 1);
    }
    if (out.items.len == 0) try out.appendSlice(alloc, "section");
    return try out.toOwnedSlice(alloc);
}

fn renderHeading(alloc: Allocator, out: *std.ArrayList(u8), level: []const u8, content: []const u8) !void {
    const slug = try slugify(alloc, content);
    defer alloc.free(slug);
    try out.print(alloc, "<h{s} id=\"{s}\"><a href=\"#{s}\">", .{ level, slug, slug });
    try renderInline(alloc, out, content);
    try out.print(alloc, "</a></h{s}>\n", .{level});
}

fn renderInline(alloc: Allocator, out: *std.ArrayList(u8), text: []const u8) !void {
    var i: usize = 0;
    while (i < text.len) {
        if (text[i] == '{' and i + 1 < text.len and text[i + 1] == '{') {
            const end = mem.indexOf(u8, text[i + 2 ..], "}}") orelse {
                _ = try out.append(alloc, text[i]);
                i += 1;
                continue;
            };
            const nid = g_note_id;
            g_note_id += 1;
            try out.print(alloc,
                "<span class=\"sidenote\" id=\"sn-{d}\"><a class=\"sn-marker\" href=\"#sn-{d}\" aria-label=\"open note\">{d}</a><span class=\"sn-body\"><a class=\"sn-close\" href=\"#sn-{d}\" aria-label=\"close note\">&#10005;</a><span class=\"sn-num\">{d}</span>",
                .{ nid, nid, nid + 1, nid, nid + 1 },
            );
            try renderInline(alloc, out, mem.trim(u8, text[i + 2 .. i + 2 + end], " "));
            try out.appendSlice(alloc, "</span></span>");
            i = i + 2 + end + 2;
            continue;
        }
        if (text[i] == '`' and i + 1 < text.len and text[i + 1] != '`') {
            const end = mem.indexOf(u8, text[i + 1 ..], "`") orelse {
                _ = try out.append(alloc, text[i]);
                i += 1;
                continue;
            };
            try out.appendSlice(alloc, "<code>");
            try escapeHtml(alloc, out, text[i + 1 .. i + 1 + end]);
            try out.appendSlice(alloc, "</code>");
            i = i + 1 + end + 1;
            continue;
        }
        if (i + 2 < text.len and text[i] == '*' and text[i + 1] == '*' and text[i + 2] == '*') {
            const end = mem.indexOf(u8, text[i + 3 ..], "***") orelse {
                try out.appendSlice(alloc, "**");
                i += 2;
                continue;
            };
            try out.appendSlice(alloc, "<span class=\"accent\"><em>");
            try renderInline(alloc, out, text[i + 3 .. i + 3 + end]);
            try out.appendSlice(alloc, "</em></span>");
            i = i + 3 + end + 3;
            continue;
        }
        if (i + 1 < text.len and text[i] == '*' and text[i + 1] == '*') {
            const end = mem.indexOf(u8, text[i + 2 ..], "**") orelse {
                try out.appendSlice(alloc, "**");
                i += 2;
                continue;
            };
            try out.appendSlice(alloc, "<span class=\"accent\">");
            try renderInline(alloc, out, text[i + 2 .. i + 2 + end]);
            try out.appendSlice(alloc, "</span>");
            i = i + 2 + end + 2;
            continue;
        }
        if (text[i] == '*' and (i + 1 >= text.len or text[i + 1] != '*')) {
            const end = mem.indexOf(u8, text[i + 1 ..], "*") orelse {
                _ = try out.append(alloc, text[i]);
                i += 1;
                continue;
            };
            try out.appendSlice(alloc, "<em>");
            try renderInline(alloc, out, text[i + 1 .. i + 1 + end]);
            try out.appendSlice(alloc, "</em>");
            i = i + 1 + end + 1;
            continue;
        }
        if (text[i] == '[') {
            const close = mem.indexOf(u8, text[i + 1 ..], "]") orelse {
                _ = try out.append(alloc, text[i]);
                i += 1;
                continue;
            };
            if (i + 1 + close + 1 < text.len and text[i + 1 + close + 1] == '(') {
                const url_end = mem.indexOf(u8, text[i + 1 + close + 2 ..], ")") orelse {
                    _ = try out.append(alloc, text[i]);
                    i += 1;
                    continue;
                };
                try out.appendSlice(alloc, "<a href=\"");
                try out.appendSlice(alloc, text[i + 1 + close + 2 .. i + 1 + close + 2 + url_end]);
                try out.appendSlice(alloc, "\">");
                try renderInline(alloc, out, text[i + 1 .. i + 1 + close]);
                try out.appendSlice(alloc, "</a>");
                i = i + 1 + close + 2 + url_end + 1;
                continue;
            }
        }
        if (text[i] == '!' and i + 1 < text.len and text[i + 1] == '[') {
            const close = mem.indexOf(u8, text[i + 2 ..], "]") orelse {
                _ = try out.append(alloc, text[i]);
                i += 1;
                continue;
            };
            if (i + 2 + close + 1 < text.len and text[i + 2 + close + 1] == '(') {
                const url_end = mem.indexOf(u8, text[i + 2 + close + 2 ..], ")") orelse {
                    _ = try out.append(alloc, text[i]);
                    i += 1;
                    continue;
                };
                const dest = text[i + 2 + close + 2 .. i + 2 + close + 2 + url_end];
                const alt = text[i + 2 .. i + 2 + close];

                // Parse url, optional caption ("..."), optional width (=NNN).
                var url = dest;
                var caption: []const u8 = "";
                var width: []const u8 = "";
                const sp = mem.indexOfAny(u8, dest, " \"");
                if (sp) |s| {
                    url = dest[0..s];
                }
                if (mem.indexOfScalar(u8, dest, '"')) |q| {
                    if (mem.lastIndexOfScalar(u8, dest, '"')) |q2| {
                        if (q2 > q) caption = dest[q + 1 .. q2];
                    }
                }
                if (mem.indexOfScalar(u8, dest, '=')) |eq| {
                    const w = mem.trim(u8, dest[eq + 1 ..], " ");
                    if (w.len > 0) width = w;
                }

                try out.appendSlice(alloc, "<figure class=\"img\">\n<img src=\"");
                try out.appendSlice(alloc, url);
                try out.appendSlice(alloc, "\" alt=\"");
                try escapeHtml(alloc, out, alt);
                try out.appendSlice(alloc, "\" loading=\"lazy\"");
                if (width.len > 0) {
                    try out.print(alloc, " width=\"{s}\"", .{width});
                }
                try out.appendSlice(alloc, ">\n");
                if (caption.len > 0) {
                    try out.appendSlice(alloc, "<figcaption>");
                    try renderInline(alloc, out, mem.trim(u8, caption, " "));
                    try out.appendSlice(alloc, "</figcaption>\n");
                }
                try out.appendSlice(alloc, "</figure>\n");
                i = i + 2 + close + 2 + url_end + 1;
                continue;
            }
        }
        _ = try out.append(alloc, text[i]);
        i += 1;
    }
}

fn escapeHtml(alloc: Allocator, out: *std.ArrayList(u8), text: []const u8) !void {
    for (text) |c| {
        switch (c) {
            '<' => try out.appendSlice(alloc, "&lt;"),
            '>' => try out.appendSlice(alloc, "&gt;"),
            '&' => try out.appendSlice(alloc, "&amp;"),
            '"' => try out.appendSlice(alloc, "&quot;"),
            else => {
                _ = try out.append(alloc, c);
            },
        }
    }
}

// ---------------------------------------------------------------------------
// Template engine
// ---------------------------------------------------------------------------

fn readTemplate(alloc: Allocator, name: []const u8, io: Io, cwd: fs) ![]const u8 {
    const path = try fs.path.join(alloc, &.{ "templates", name });
    defer alloc.free(path);
    return try cwd.readFileAlloc(io, path, alloc, .limited(1024 * 1024));
}

fn substitute(alloc: Allocator, out: *std.ArrayList(u8), template: []const u8, vars: anytype) !void {
    var i: usize = 0;
    while (i < template.len) {
        if (i + 1 < template.len and template[i] == '{' and template[i + 1] == '{') {
            const end = mem.indexOf(u8, template[i + 2 ..], "}}") orelse {
                _ = try out.append(alloc, template[i]);
                i += 1;
                continue;
            };
            const key = mem.trim(u8, template[i + 2 .. i + 2 + end], " ");
            try writeVar(alloc, out, key, vars);
            i = i + 2 + end + 2;
        } else {
            _ = try out.append(alloc, template[i]);
            i += 1;
        }
    }
}

fn writeVar(alloc: Allocator, out: *std.ArrayList(u8), key: []const u8, vars: anytype) !void {
    const info = @typeInfo(@TypeOf(vars));
    inline for (info.@"struct".fields) |field| {
        if (mem.eql(u8, key, field.name)) {
            const val = @field(vars, field.name);
            const T = @TypeOf(val);
            switch (@typeInfo(T)) {
                .pointer => |ptr| {
                    if (ptr.size == .slice) {
                        try out.appendSlice(alloc, val);
                    } else if (ptr.size == .one and ptr.is_const) {
                        const child = @typeInfo(ptr.child);
                        if (child == .array and child.array.child == u8) {
                            try out.appendSlice(alloc, val);
                        } else {
                            @compileError("unsupported template var type: " ++ @typeName(T));
                        }
                    } else {
                        @compileError("unsupported template var type: " ++ @typeName(T));
                    }
                },
                else => @compileError("unsupported template var type: " ++ @typeName(T)),
            }
            return;
        }
    }
    try out.appendSlice(alloc, "{{");
    try out.appendSlice(alloc, key);
    try out.appendSlice(alloc, "}}");
}

// ---------------------------------------------------------------------------
// Page generators
// ---------------------------------------------------------------------------

fn generateIndex(alloc: Allocator, posts: []const Post, io: Io, cwd: fs) !void {
    const tmpl = try readTemplate(alloc, "index.html", io, cwd);
    defer alloc.free(tmpl);

    var post_list = std.ArrayList(u8).empty;
    defer post_list.deinit(alloc);

    for (posts) |post| {
        try post_list.appendSlice(alloc, "<li>\n<span class=\"post-date\">");
        try post_list.appendSlice(alloc, post.date);
        try post_list.appendSlice(alloc, "</span> <a href=\"posts/");
        try post_list.appendSlice(alloc, post.slug);
        try post_list.appendSlice(alloc, ".html\">");
        try escapeHtml(alloc, &post_list, post.title);
        try post_list.appendSlice(alloc, "</a>\n</li>\n");
    }

    const about_block = try renderAboutBlock(alloc, io, cwd);
    defer alloc.free(about_block);

    var out = std.ArrayList(u8).empty;
    defer out.deinit(alloc);

    try substitute(alloc, &out, tmpl, .{
        .site_name = site_name,
        .site_description = site_description,
        .post_list = post_list.items,
        .about_block = about_block,
    });

    try writeFile("site/index.html", out.items, io, cwd);
}

fn renderAboutBlock(alloc: Allocator, io: Io, cwd: fs) ![]const u8 {
    const md = try cwd.readFileAlloc(io, "content/about.md", alloc, .limited(1024 * 1024));
    defer alloc.free(md);

    var out = std.ArrayList(u8).empty;
    errdefer out.deinit(alloc);

    try out.appendSlice(alloc, "<pre class=\"about\">\n");

    var lines = std.ArrayList([]const u8).empty;
    defer lines.deinit(alloc);
    var line_it = std.mem.splitScalar(u8, md, '\n');
    while (line_it.next()) |l| {
        try lines.append(alloc, std.mem.trim(u8, l, "\r"));
    }

    var first_block = true;
    var first_line_of_block = true;
    var after_heading = false;
    for (lines.items) |line| {
        const t = std.mem.trim(u8, line, " ");
        if (t.len == 0) {
            // blank line: skip if it directly follows a heading
            if (after_heading) {
                after_heading = false;
                continue;
            }
            // otherwise separate blocks
            if (!first_line_of_block) {
                try out.append(alloc, '\n');
                first_line_of_block = true;
            }
            continue;
        }
        if (std.mem.startsWith(u8, t, "## ")) {
            const title = std.mem.trim(u8, t[3..], " ");
            if (!first_block) {
                try out.append(alloc, '\n');
            }
            first_block = false;
            try out.appendSlice(alloc, "<span class=\"about-cm\"># ");
            try escapeHtml(alloc, &out, title);
            try out.appendSlice(alloc, "</span>\n");
            first_line_of_block = false;
            after_heading = true;
            continue;
        }
        after_heading = false;
        // inline content line
        try renderAboutInline(alloc, &out, t);
        try out.append(alloc, '\n');
        first_line_of_block = false;
    }

    try out.appendSlice(alloc, "</pre>\n");
    return try out.toOwnedSlice(alloc);
}

fn renderAboutInline(alloc: Allocator, out: *std.ArrayList(u8), line: []const u8) !void {
    // **Label** prefix → accent span
    if (std.mem.startsWith(u8, line, "**")) {
        if (std.mem.indexOf(u8, line[2..], "**")) |end| {
            const label = line[2 .. 2 + end];
            const rest = std.mem.trimStart(u8, line[2 + end + 2 ..], " ");
            try out.appendSlice(alloc, "<span class=\"about-label\">");
            try escapeHtml(alloc, out, label);
            try out.appendSlice(alloc, "</span> ");
            try renderAboutInline(alloc, out, rest);
            return;
        }
    }
    // [label](url) link
    var remaining = line;
    while (std.mem.indexOf(u8, remaining, "](")) |cb| {
        if (std.mem.indexOf(u8, remaining, "[")) |ob| {
            if (ob < cb) {
                try escapeHtml(alloc, out, remaining[0..ob]);
                const label = remaining[ob + 1 .. cb];
                const rest = remaining[cb + 2 ..];
                if (std.mem.indexOfScalar(u8, rest, ')')) |end| {
                    const url = rest[0..end];
                    try out.appendSlice(alloc, "<a href=\"");
                    try escapeHtml(alloc, out, url);
                    try out.appendSlice(alloc, "\">");
                    try escapeHtml(alloc, out, label);
                    try out.appendSlice(alloc, "</a>");
                    remaining = rest[end + 1 ..];
                    continue;
                }
            }
        }
        try escapeHtml(alloc, out, remaining);
        return;
    }
    try escapeHtml(alloc, out, remaining);
}

fn generatePostPages(alloc: Allocator, posts: []const Post, io: Io, cwd: fs) !void {
    const tmpl = try readTemplate(alloc, "post.html", io, cwd);
    defer alloc.free(tmpl);

    for (posts) |post| {
        var out = std.ArrayList(u8).empty;
        defer out.deinit(alloc);

        var tags_html = std.ArrayList(u8).empty;
        defer tags_html.deinit(alloc);

        for (post.tags.items, 0..) |tag, idx| {
            if (idx > 0) try tags_html.appendSlice(alloc, ", ");
            try tags_html.appendSlice(alloc, "<span class=\"tag\">");
            try escapeHtml(alloc, &tags_html, tag);
            try tags_html.appendSlice(alloc, "</span>");
        }

        try substitute(alloc, &out, tmpl, .{
            .site_name = site_name,
            .site_description = site_description,
            .base = "../",
            .post_title = post.title,
            .post_date = post.date,
            .post_tags = tags_html.items,
            .post_description = post.description,
            .post_content = post.body_html,
        });

        const filename = try std.fmt.allocPrint(alloc, "site/posts/{s}.html", .{post.slug});
        defer alloc.free(filename);
        try writeFile(filename, out.items, io, cwd);
    }
}

fn generateProjectsPage(alloc: Allocator, io: Io, cwd: fs) !void {
    const md = try cwd.readFileAlloc(io, "content/projects.md", alloc, .limited(1024 * 1024));
    defer alloc.free(md);

    const cards_html = try generateProjectsCards(alloc, md);
    defer alloc.free(cards_html);

    const tmpl = try readTemplate(alloc, "projects.html", io, cwd);
    defer alloc.free(tmpl);

    var out = std.ArrayList(u8).empty;
    defer out.deinit(alloc);

    try substitute(alloc, &out, tmpl, .{
        .site_name = site_name,
        .base = "",
        .project_cards = cards_html,
    });

    try writeFile("site/projects.html", out.items, io, cwd);
}

fn generateProjectsCards(alloc: Allocator, md: []const u8) ![]const u8 {
    var out = std.ArrayList(u8).empty;
    errdefer out.deinit(alloc);

    try out.appendSlice(alloc, "<section class=\"project-list\">\n");

    var sections = std.mem.splitSequence(u8, md, "\n---\n");
    while (sections.next()) |section| {
        const trimmed = std.mem.trim(u8, section, " \n\r");
        if (trimmed.len == 0) continue;

        var lines = std.ArrayList([]const u8).empty;
        defer lines.deinit(alloc);
        var line_it = std.mem.splitScalar(u8, trimmed, '\n');
        while (line_it.next()) |l| {
            try lines.append(alloc, std.mem.trim(u8, l, "\r"));
        }
        if (lines.items.len == 0) continue;

        // find ## heading
        var name: []const u8 = "";
        var name_idx: usize = 0;
        for (lines.items, 0..) |line, idx| {
            if (std.mem.startsWith(u8, line, "## ")) {
                name = std.mem.trim(u8, line[3..], " ");
                name_idx = idx;
                break;
            }
        }
        if (name.len == 0) continue;

        // find tagline (first **text**)
        var tagline: []const u8 = "";
        var tagline_idx: usize = 0;
        for (lines.items[name_idx + 1 ..], name_idx + 1..) |line, idx| {
            if (std.mem.indexOf(u8, line, "**")) |start| {
                if (std.mem.indexOf(u8, line[start + 2 ..], "**")) |end| {
                    tagline = line[start + 2 .. start + 2 + end];
                    tagline_idx = idx;
                    break;
                }
            }
        }

        // find metadata and source lines
        var meta_idx: ?usize = null;
        var source_idx: ?usize = null;
        for (lines.items[tagline_idx + 1 ..], tagline_idx + 1..) |line, idx| {
            if (std.mem.indexOf(u8, line, "·") != null) meta_idx = idx;
            if (std.mem.startsWith(u8, line, "[")) source_idx = idx;
        }

        // parse timeline from metadata
        var timeline: []const u8 = "";
        if (meta_idx) |mi| {
            const meta = lines.items[mi];
            var status: []const u8 = "";
            var period: []const u8 = "";
            var field_it = std.mem.splitSequence(u8, meta, "·");
            while (field_it.next()) |field| {
                const f = std.mem.trim(u8, field, " ");
                if (std.mem.startsWith(u8, f, "Status:")) {
                    status = std.mem.trim(u8, f[7..], " ");
                } else if (std.mem.startsWith(u8, f, "Period:")) {
                    period = std.mem.trim(u8, f[7..], " ");
                }
            }
            if (std.mem.eql(u8, status, "active")) {
                var clean = std.mem.trim(u8, period, " ");
                while (std.mem.endsWith(u8, clean, "—")) {
                    clean = clean[0 .. clean.len - 3];
                }
                while (std.mem.endsWith(u8, clean, "-") or std.mem.endsWith(u8, clean, " ")) {
                    clean = clean[0 .. clean.len - 1];
                }
                timeline = try std.fmt.allocPrint(alloc, "{s} — present", .{clean});
            } else if (std.mem.eql(u8, status, "maybe done")) {
                var clean = std.mem.trim(u8, period, " ");
                while (std.mem.endsWith(u8, clean, "—")) {
                    clean = clean[0 .. clean.len - 3];
                }
                while (std.mem.endsWith(u8, clean, "-") or std.mem.endsWith(u8, clean, " ")) {
                    clean = clean[0 .. clean.len - 1];
                }
                timeline = try std.fmt.allocPrint(alloc, "{s} — done", .{clean});
            } else {
                timeline = try std.fmt.allocPrint(alloc, "{s}", .{period});
            }
        }

        // parse source
        var source_url: []const u8 = "";
        var source_label: []const u8 = "source";
        if (source_idx) |si| {
            const src_line = lines.items[si];
            if (std.mem.indexOf(u8, src_line, "](")) |cb| {
                if (std.mem.lastIndexOf(u8, src_line, ")")) |end| {
                    source_label = std.mem.trim(u8, src_line[1..cb], " ");
                    source_url = std.mem.trim(u8, src_line[cb + 2 .. end], " ");
                }
            }
        }

        // write card
        try out.appendSlice(alloc, "<article class=\"project-card\">\n");
        try out.appendSlice(alloc, "<div class=\"project-header\">\n<h2 class=\"project-name\"><a href=\"");
        try out.appendSlice(alloc, source_url);
        try out.appendSlice(alloc, "\">");
        try out.appendSlice(alloc, name);
        try out.appendSlice(alloc, "</a></h2>\n<div class=\"project-header-right\">\n<a href=\"");
        try out.appendSlice(alloc, source_url);
        try out.appendSlice(alloc, "\" class=\"project-source\">");
        try out.appendSlice(alloc, source_label);
        try out.appendSlice(alloc, " &nearr;</a>\n<span class=\"project-timeline\">");
        try out.appendSlice(alloc, timeline);
        try out.appendSlice(alloc, "</span>\n</div>\n</div>\n");
        try out.appendSlice(alloc, "<div class=\"project-body\">\n<p class=\"project-tagline\">");
        try out.appendSlice(alloc, tagline);
        try out.appendSlice(alloc, "</p>\n");

        // render body: skip heading, tagline, blank, metadata, source, separators
        var in_list = false;
        for (lines.items, 0..) |line, idx| {
            const t = std.mem.trim(u8, line, " ");
            if (idx == name_idx or idx == tagline_idx) continue;
            if (t.len == 0) continue;
            if (meta_idx != null and idx == meta_idx.?) continue;
            if (source_idx != null and idx == source_idx.?) continue;
            if (std.mem.eql(u8, t, "---")) continue;

            if (std.mem.startsWith(u8, t, "- ")) {
                if (!in_list) {
                    try out.appendSlice(alloc, "<ul class=\"project-features\">\n");
                    in_list = true;
                }
                try out.appendSlice(alloc, "<li>");
                try renderBold(alloc, &out, t[2..]);
                try out.appendSlice(alloc, "</li>\n");
            } else {
                if (in_list) {
                    try out.appendSlice(alloc, "</ul>\n");
                    in_list = false;
                }
                try out.appendSlice(alloc, "<p class=\"project-desc\">");
                try renderBold(alloc, &out, t);
                try out.appendSlice(alloc, "</p>\n");
            }
        }
        if (in_list) try out.appendSlice(alloc, "</ul>\n");

        // free timeline if it was allocPrint'd
        if (meta_idx != null) alloc.free(timeline);

        try out.appendSlice(alloc, "</div>\n</article>\n");
    }

    try out.appendSlice(alloc, "</section>\n");
    return try out.toOwnedSlice(alloc);
}

fn renderBold(alloc: Allocator, out: *std.ArrayList(u8), text: []const u8) !void {
    var remaining = text;
    while (std.mem.indexOf(u8, remaining, "**")) |start| {
        try escapeHtml(alloc, out, remaining[0..start]);
        const rest = remaining[start + 2 ..];
        if (std.mem.indexOf(u8, rest, "**")) |end| {
            try out.appendSlice(alloc, "<strong>");
            try escapeHtml(alloc, out, rest[0..end]);
            try out.appendSlice(alloc, "</strong>");
            remaining = rest[end + 2 ..];
        } else {
            try out.appendSlice(alloc, "**");
            remaining = rest;
        }
    }
    try escapeHtml(alloc, out, remaining);
}

fn generateRSS(alloc: Allocator, posts: []const Post, io: Io, cwd: fs) !void {
    const tmpl = try readTemplate(alloc, "rss.xml", io, cwd);
    defer alloc.free(tmpl);

    var items_xml = std.ArrayList(u8).empty;
    defer items_xml.deinit(alloc);

    for (posts) |post| {
        try items_xml.appendSlice(alloc, "    <item>\n      <title>");
        try escapeHtml(alloc, &items_xml, post.title);
        try items_xml.appendSlice(alloc, "</title>\n      <link>");
        try items_xml.appendSlice(alloc, site_url);
        try items_xml.appendSlice(alloc, "/posts/");
        try items_xml.appendSlice(alloc, post.slug);
        try items_xml.appendSlice(alloc, ".html</link>\n      <description>");
        try escapeHtml(alloc, &items_xml, post.description);
        try items_xml.appendSlice(alloc, "</description>\n      <pubDate>");
        try items_xml.appendSlice(alloc, post.date);
        try items_xml.appendSlice(alloc, "</pubDate>\n    </item>\n");
    }

    var out = std.ArrayList(u8).empty;
    defer out.deinit(alloc);

    try substitute(alloc, &out, tmpl, .{
        .site_name = site_name,
        .site_url = site_url,
        .site_description = site_description,
        .site_author = site_author,
        .items = items_xml.items,
    });

    try writeFile("site/feed.xml", out.items, io, cwd);
}

fn writeFile(path: []const u8, content: []const u8, io: Io, cwd: fs) !void {
    const f = try cwd.createFile(io, path, .{});
    defer f.close(io);
    try f.writePositionalAll(io, content, 0);
}
