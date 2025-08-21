# generate static pages from markdown

import glob
import os
import markdown
import shutil
from collections import defaultdict
from datetime import datetime
from email.utils import format_datetime

BLOG_PATH = "./content/**/*.md"
PUBLIC = "public"

def get_all_markdown():
    return [f for f in glob.glob(BLOG_PATH, recursive=True)]

def handle_header(md):
    #remove the header
    lines = md.splitlines()
    if lines[0].strip()!='---':
        return md, {}
    
    fields = {}
    slug_end = 1
    while lines[slug_end].strip()!='---':
        name = lines[slug_end].strip().split(': ')[0]
        value = ' '.join(lines[slug_end].strip().split(': ')[1:]).replace("\"", "")
        fields[name] = value
        slug_end += 1
    
    if 'post' in fields and fields['post']=='False':
        fields['post'] = False
    else:
        fields['post'] = True
        
    return '\n'.join(lines[slug_end+1:]), fields

def handle_post(filename, html_str):
    with open(filename, 'r', encoding="utf8") as f:
        md = f.read()
    
    #remove the header
    md, fields = handle_header(md)

    html_str = html_str.format(
        title=fields["title"],
        subtitle=fields.get("date") or fields.get("subtitle"),
        content=markdown.markdown(md, extensions=['fenced_code', 'sane_lists']),
    )

    name = filename.split('/')[-1].split('.')[0]
    fields['url'] = f"{name}.html"
    output_file = f"{PUBLIC}/{name}.html"

    with open(output_file, 'w') as f:
        _ = f.write(html_str)
    
    return fields

def create_posts_category_page(category_name, category_fields, base_html):
    with open("post_format.html", 'r') as f:
        one_post = f.read()
    
    posts = []
    for f in category_fields:
        if not f['post']:
            # don't list index, license, and this page
            continue
        posts.append(one_post.format(
            title=f.get("title"),
            subtitle=f.get("subtitle"),
            date=f.get("date"),
            url=f.get("url"),
            summary=f.get("summary"),
        ))
    
    html_str = base_html.format(
        title=category_name.capitalize(),
        subtitle="Sorted by date",
        content="\n".join(posts),
    )

    with open(f"{PUBLIC}/{category_name}_posts.html", "w") as f:
        _ = f.write(html_str)

def create_posts_page(fields, base_html):
    # create the per-category post listing pages
    category_to_posts = defaultdict(list)
    for f in fields:
        if not f.get("post", False):
            # non-post pages include index, license, and this page
            continue
        category_to_posts[f["category"]].append(f)
    
    for (category_name, posts) in category_to_posts.items():
        create_posts_category_page(category_name, posts, base_html)
    
    base_category_html = """
<a class="listlink" href="{url}">
    <p class="listtext">{text}</p>
</a>
"""
    content = (
        '<div class="categories">'
        + '\n'.join(
            base_category_html.format(
                text=category_name.capitalize(),
                url=f"{category_name}_posts.html"
            )
            for category_name in category_to_posts.keys()
        ) + '</div>'
    )

    # create a page listing the category pages
    html_str = base_html.format(
        title="Post Categories",
        subtitle="",
        content=content,
    )
    with open(f"{PUBLIC}/posts.html", 'w') as f:
        _ = f.write(html_str) 

def create_rss(fields):
    with open("rss_format.xml", "r") as f:
        base_rss = f.read()
    
    with open("rss_item_format.xml", "r") as f:
        rss_item = f.read()
    
    items = []
    for f in fields:
        if not f.get("post", False):
            # non-post pages include index, license
            continue
        items.append(rss_item.format(
            title=f.get("title"),
            description=f.get("summary"),
            link="https://bill.batemanzhou.com/" + f.get("url"),
            category=f.get("category"),
            # format date nicely
            pubDate=format_datetime(datetime.strptime(f.get("date"), '%Y-%m-%d')),
        ))
    
    rss_str = base_rss.format(
        items="\n".join(items),
    )

    with open(f"{PUBLIC}/rss.xml", 'w') as f:
        _ = f.write(rss_str)

def main():
    # replace existing files
    if os.path.exists(f"./{PUBLIC}"):
        shutil.rmtree(f"./{PUBLIC}")
    shutil.copytree(f"./data", f"./{PUBLIC}")

    # use layout.html as the base for all posts
    with open("layout.html", "r") as f:
        base_html = f.read()

    posts = [filename for filename in get_all_markdown()]
    fields = [handle_post(post, base_html) for post in posts]
    fields.sort(key=lambda x: x.get("date", "1970-1-1"), reverse=True) # sort with newest posts first
    
    # create a page listing all posts
    create_posts_page(fields, base_html)

    # make the rss feed
    create_rss(fields)
        

if __name__=="__main__":
    main()