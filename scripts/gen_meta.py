#!/usr/bin/env python3
"""Generate static metadata from src/Content/Posts.elm:
   rss.xml · sitemap.xml · robots.txt

The post records in Content/Posts.elm are kept in a strict layout so this
script can harvest metadata without an Elm parser. If you change the record
layout there, update PATTERNS here.
"""

import re
from datetime import datetime, timezone

SITE_URL = "https://vixel2006.github.io/blog/"
POSTS_SRC = "src/Content/Posts.elm"

PATTERNS = {
    "slug": r'slug\s*=\s*"([^"]+)"',
    "title": r'title\s*=\s*"([^"]*)"',
    "description": r'description\s*=\s*"""(.*?)"""',
    "status": r'status\s*=\s*"(\w+)"',
}


def load_posts():
    src = open(POSTS_SRC).read()
    region = re.search(r"posts :.*?\nposts =\n(.*?)\n    \]", src, re.DOTALL)
    if not region:
        raise SystemExit("could not locate the posts list in " + POSTS_SRC)
    body = region.group(1)

    records = re.split(r"\n\s*\},?\s*", body)
    posts = []
    for rec in records:
        fields = {}
        ok = True
        for key, pat in PATTERNS.items():
            m = re.search(pat, rec, re.DOTALL)
            if not m:
                ok = False
                break
            fields[key] = m.group(1).strip()
        if not ok:
            continue
        tags = re.findall(r'"([^"]*)"', re.search(r"tags\s*=\s*\[([^\]]*)\]", rec, re.DOTALL).group(1)) if re.search(r"tags\s*=\s*\[([^\]]*)\]", rec, re.DOTALL) else []
        fields["tags"] = tags
        posts.append(fields)
    return posts


def rfc822(slug_date):
    dt = datetime.strptime(slug_date, "%Y-%m-%d").replace(
        hour=12, tzinfo=timezone.utc
    )
    return dt.strftime("%a, %d %b %Y %H:%M:%S %z").replace("+0000", "+0000") or dt.strftime("%a, %d %b %Y %H:%M:%S GMT")


def esc(s):
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def write_rss(posts):
    items = []
    for p in posts:
        url = f"{SITE_URL}#/writing/{p['slug']}"
        items.append(
            f"""    <item>
      <title>{esc(p["title"])}</title>
      <link>{url}</link>
      <guid isPermaLink="false">{p["slug"]}</guid>
      <pubDate>{rfc822(p["slug"][:10])}</pubDate>
      <description>{esc(p["description"])}</description>
{"".join(f"      <category>{esc(t)}</category>\n" for t in p["tags"])}    </item>"""
        )

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VIXEL — field notes</title>
    <link>{SITE_URL}</link>
    <atom:link href="{SITE_URL}rss.xml" rel="self" type="application/rss+xml"/>
    <description>Machines, systems, and ideas. A lab notebook of robotics middleware, deep learning runtimes, world models and embedded electronics.</description>
    <language>en</language>
    <lastBuildDate>{datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")}</lastBuildDate>
{chr(10).join(items)}
  </channel>
</rss>
"""
    open("rss.xml", "w").write(xml)


def write_sitemap(posts):
    urls = [SITE_URL, SITE_URL + "#/writing", SITE_URL + "#/projects",
            SITE_URL + "#/research", SITE_URL + "#/about"]
    entries = [
        f"  <url><loc>{u}</loc></url>" for u in urls
    ] + [
        f"  <url><loc>{SITE_URL}#/writing/{p['slug']}</loc>"
        f"<lastmod>{p['slug'][:10]}</lastmod></url>"
        for p in posts
    ]
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    open("sitemap.xml", "w").write(xml)


def write_robots():
    open("robots.txt", "w").write(
        f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}sitemap.xml\n"
    )


if __name__ == "__main__":
    posts = load_posts()
    print(f"  parsed {len(posts)} posts from {POSTS_SRC}")
    write_rss(posts)
    print("  ✓ rss.xml")
    write_sitemap(posts)
    print("  ✓ sitemap.xml")
    write_robots()
    print("  ✓ robots.txt")
