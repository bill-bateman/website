# generate static pages from markdown

import glob
import os
import markdown
import shutil

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

def create_posts_page(fields, base_html):
    with open("post_format.html", 'r') as f:
        one_post = f.read()
    
    posts = []
    fields.sort(key=lambda x: x.get("date", ""), reverse=True)
    for f in fields:
        if not f['post']:
            # don't list index, license, and this page
            continue
        posts.append(one_post.format(
            title=f['title'],
            subtitle=f.get("subtitle"),
            date=f.get("date"),
            url=f['url'],
        ))
    
    html_str = base_html.format(
        title="Posts",
        subtitle="Sorted by date",
        content='\n'.join(posts),
    )

    with open(f"{PUBLIC}/posts.html", 'w') as f:
        _ = f.write(html_str) 


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
    
    # create a page listing all posts
    create_posts_page(fields, base_html)
        

if __name__=="__main__":
    main()