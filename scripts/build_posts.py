#!/usr/bin/env python3
"""Build posts from Markdown files with YAML frontmatter.
Generates:
  - src/Content/Posts.elm (Elm module with Post type and posts list)
  - rss.xml, sitemap.xml, robots.txt (static metadata)
"""

import os
import re
import yaml
from datetime import datetime, timezone
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional

POSTS_DIR = Path("posts")
ELM_OUTPUT = Path("src/Content/Posts.elm")
SITE_URL = "https://vixel2006.github.io/blog/"


@dataclass
class Post:
    slug: str
    number: int
    title: str
    description: str
    tags: List[str]
    status: str
    body: str
    date: str = field(init=False)

    def __post_init__(self):
        # Extract date from slug (format: YYYY-MM-DD-...)
        self.date = self.slug[:10]


def parse_markdown_file(path: Path) -> Optional[Post]:
    """Parse a markdown file with YAML frontmatter."""
    content = path.read_text(encoding="utf-8")

    # Match YAML frontmatter between --- delimiters
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if not match:
        print(f"  [X] {path.name}: no valid frontmatter")
        return None

    frontmatter_str, body = match.groups()

    try:
        fm = yaml.safe_load(frontmatter_str)
    except yaml.YAMLError as e:
        print(f"  [X] {path.name}: invalid YAML - {e}")
        return None

    # Validate required fields
    required = ["slug", "number", "title", "description", "tags", "status"]
    for field in required:
        if field not in fm:
            print(f"  [X] {path.name}: missing required field '{field}'")
            return None

    # Validate status
    valid_statuses = {"complete", "drafting", "unfinished"}
    if fm["status"] not in valid_statuses:
        print(f"  [X] {path.name}: invalid status '{fm['status']}' (must be one of {valid_statuses})")
        return None

    return Post(
        slug=fm["slug"],
        number=fm["number"],
        title=fm["title"],
        description=fm["description"],
        tags=fm["tags"],
        status=fm["status"],
        body=body.strip()
    )


def load_all_posts() -> List[Post]:
    """Load all posts from the posts directory, sorted newest first."""
    posts = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        post = parse_markdown_file(path)
        if post:
            posts.append(post)
            print(f"  [OK] {path.name} (FN-{post.number:02d})")

    # Sort by date from slug (newest first)
    posts.sort(key=lambda p: p.date, reverse=True)
    return posts


def escape_elm_string(s: str) -> str:
    """Escape a string for Elm triple-quoted string."""
    # Elm uses """...""" for multi-line strings
    # We need to escape: \  and  """
    s = s.replace("\\", "\\\\")
    s = s.replace('"""', '\\"""')
    return s


def escape_xml(s: str) -> str:
    """Escape for XML."""
    quot = '"'
    apos = "'"
    quot_entity = '"'
    return (
        s.replace("&", "&")
         .replace("<", "<")
         .replace(">", ">")
         .replace(quot, quot_entity)
         .replace(apos, "&apos;")
    )


def rfc822(date_str: str) -> str:
    """Convert YYYY-MM-DD to RFC822 format."""
    dt = datetime.strptime(date_str, "%Y-%m-%d").replace(hour=12, tzinfo=timezone.utc)
    return dt.strftime("%a, %d %b %Y %H:%M:%S %z").replace("+0000", "+0000")


def generate_elm_module(posts: List[Post]) -> str:
    """Generate the Elm module content."""
    lines = []
    lines.append("module Content.Posts exposing (Post, posts)")
    lines.append("")
    lines.append("{-| The written record. Newest first.")
    lines.append("")
    lines.append("Generated from Markdown files in posts/ by scripts/build_posts.py")
    lines.append("-}")
    lines.append("")
    lines.append("")
    lines.append("-- MODEL ---------------------------------------------------------------------")
    lines.append("")
    lines.append("")
    lines.append("type alias Post =")
    lines.append("    { slug : String")
    lines.append("    , number : Int -- FIELD NOTE nn, assigned chronologically")
    lines.append("    , title : String")
    lines.append("    , description : String")
    lines.append("    , tags : List String")
    lines.append("    , status : String -- complete | drafting | unfinished")
    lines.append("    , body : String")
    lines.append("    }")
    lines.append("")
    lines.append("")
    lines.append("-- INDEX ----------------------------------------------------------------------")
    lines.append("")
    lines.append("")
    lines.append("posts : List Post")
    lines.append("posts =")
    lines.append("    [")
    
    for i, post in enumerate(posts):
        body_escaped = escape_elm_string(post.body)
        tags_str = ", ".join(f'"{t}"' for t in post.tags)
        lines.append(f"        {{ slug = \"{post.slug}\"")
        lines.append(f"        , number = {post.number}")
        lines.append(f"        , title = \"{escape_xml(post.title)}\"")
        lines.append(f"        , description = \"\"\"{escape_xml(post.description)}\"\"\"")
        lines.append(f"        , tags = [ {tags_str} ]")
        lines.append(f"        , status = \"{post.status}\"")
        lines.append(f"        , body = \"\"\"{body_escaped}\"\"\"")
        lines.append(f"        }}")
        if i < len(posts) - 1:
            lines.append("    ,")
    
    lines.append("    ]")
    lines.append("")
    return "\n".join(lines)


def generate_rss(posts: List[Post]) -> str:
    """Generate RSS XML."""
    items = []
    for p in posts:
        url = f"{SITE_URL}#/writing/{p.slug}"
        categories = "".join(f"      <category>{escape_xml(t)}</category>\n" for t in p.tags)
        item = (
            "    <item>\n"
            f"      <title>{escape_xml(p.title)}</title>\n"
            f"      <link>{url}</link>\n"
            f"      <guid isPermaLink=\"false\">{p.slug}</guid>\n"
            f"      <pubDate>{rfc822(p.date)}</pubDate>\n"
            f"      <description>{escape_xml(p.description)}</description>\n"
            f"{categories}    </item>"
        )
        items.append(item)

    last_build = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
        '  <channel>\n'
        '    <title>VIXEL \u2014 field notes</title>\n'
        f'    <link>{SITE_URL}</link>\n'
        f'    <atom:link href="{SITE_URL}rss.xml" rel="self" type="application/rss+xml"/>\n'
        '    <description>Machines, systems, and ideas. A lab notebook of robotics middleware, deep learning runtimes, world models and embedded electronics.</description>\n'
        '    <language>en</language>\n'
        f'    <lastBuildDate>{last_build}</lastBuildDate>\n'
        + "\n".join(items) + "\n"
        '  </channel>\n'
        '</rss>\n'
    )


def generate_sitemap(posts: List[Post]) -> str:
    """Generate sitemap XML."""
    urls = [
        SITE_URL,
        SITE_URL + "#/writing",
        SITE_URL + "#/projects",
        SITE_URL + "#/research",
        SITE_URL + "#/about",
    ]
    entries = [f"  <url><loc>{u}</loc></url>" for u in urls] + [
        f"  <url><loc>{SITE_URL}#/writing/{p.slug}</loc><lastmod>{p.date}</lastmod></url>"
        for p in posts
    ]
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )


def generate_robots() -> str:
    """Generate robots.txt."""
    return "User-agent: *\nAllow: /\n\nSitemap: " + SITE_URL + "sitemap.xml\n"


def main():
    print("-> loading posts from posts/")
    posts = load_all_posts()
    print(f"  parsed {len(posts)} posts")

    # Generate Elm module
    print("-> generating src/Content/Posts.elm")
    ELM_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    ELM_OUTPUT.write_text(generate_elm_module(posts), encoding="utf-8")
    print("  [OK] Posts.elm")

    # Generate RSS
    print("-> generating rss.xml")
    Path("rss.xml").write_text(generate_rss(posts), encoding="utf-8")
    print("  [OK] rss.xml")

    # Generate sitemap
    print("-> generating sitemap.xml")
    Path("sitemap.xml").write_text(generate_sitemap(posts), encoding="utf-8")
    print("  [OK] sitemap.xml")

    # Generate robots.txt
    print("-> generating robots.txt")
    Path("robots.txt").write_text(generate_robots(), encoding="utf-8")
    print("  [OK] robots.txt")

    print("done.")


if __name__ == "__main__":
    main()