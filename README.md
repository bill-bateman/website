# About

Personal website using a dead simple static site generator based on [Python-Markdown](https://python-markdown.github.io/).

Hosted at https://bill.batemanzhou.com.

# Development

To see local changes, run `./scripts/serve.sh` from the root directory. This builds the website (using `python3 generate.py`), goes into the `public/` directory, and serves the content there on localhost.

Note that `public/` is `.gitignore`d.

Also note that dependencies are managed with `uv`.

# Deployment

Deployment happens automatically in GitHub Actions on pushes to the main branch. See `.github/workflows/build_and_deploy.yml`. It's pretty basic, it uses uv for dependency management, runs `generate.py` and `rsync`s the `public/` directory to the server.

# Licensing

Original contents of this blog, such as text, images, and music, are licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/), except where the original work is in the public domain, or otherwise indicated.

The underlying source code, and any source code contained within blog posts, are licensed under the [MIT license](https://github.com/bill-bateman/website/blob/master/LICENSE.md) unless otherwise indicated.
