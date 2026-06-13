# About

Personal website using a dead simple static site generator based on [Python-Markdown](https://python-markdown.github.io/).

Hosted at https://bill.batemanzhou.com.

# Development

Mostly notes for myself. To see local changes, run:

```py
python3 generate.py
cd public/
python3 -m http.server
```

Or, starting from `public/`, in a convenient one-liner:
```
cd .. && python3 generate.py && cd public/ && python3 -m http.server
```

# Deployment

Deployment happens automatically in GitHub Actions on pushes to the main branch. See `.github/workflows/build_and_deploy.yml`. It's pretty basic, it runs `generate.py` and `rsync`s the `public/` directory to the server.

# Licensing

Original contents of this blog, such as text, images, and music, are licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/), except where the original work is in the public domain, or otherwise indicated.

The underlying source code, and any source code contained within blog posts, are licensed under the [MIT license](https://github.com/bill-bateman/website/blob/master/LICENSE.md) unless otherwise indicated.