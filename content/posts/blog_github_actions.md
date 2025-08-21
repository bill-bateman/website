---
title: "Using Github Actions to Deploy Website"
subtitle: "tech / github_actions
date: "2021-08-10"
category: "tech"
summary: "How I use GitHub Actions to deploy this website."
---

_Last edited: 2024-01-14_

Inspired by [this post by Aleksander Jaworski](https://akjaw.com/gatsby-automatic-deployment-to-ftp/) on using CircleCI for Continuous Deployment of a personal website, I decided to do something similar with Github Actions for this website. 

Originally, I was manually building and deploying files to an FTP server that hosts my site. Clearly I could find a better solution. In the linked post, he was using CircleCI to trigger a Node.js script that would connect to his FTP server and upload the new files (along with some extra checking that the deployment was successful).

Instead of using FTP, I wanted to use rsync (with ssh). I also didn't want to use Node.js, so stuck with bash scripting. I didn't implement any check that the deployment actually worked - although if the build fails the pipeline will stop. I also used Github Secrets in order to store the user, hostname, and ssh key for deployment. I used the available [action-rsync](https://github.com/marketplace/actions/action-rsync) as a baseline for my action, but I wanted to create the entire thing from scratch so I would understand more.

You can see the action definition [in the github for this website](https://github.com/bill-bateman/website/blob/master/.github/workflows/build_and_deploy.yml).