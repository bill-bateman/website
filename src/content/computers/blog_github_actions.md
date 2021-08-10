---
slug: "/computers/github_actions"
date: "2021-08-10"
title: "Using Github Actions to Deploy Gatsby Website"
featuredImage: ../images/deploy-button.jpg
---

Inspired by [this post by Aleksander Jaworski](https://akjaw.com/gatsby-automatic-deployment-to-ftp/) on using CircleCI for Continuous Deployment of a personal website, I decided to do something similar with Github Actions for this website. 

Originally, I was manually building and deploying files to an FTP server that hosts my site. Clearly I could find a better solution. In the linked post, he was using CircleCI to trigger a Node.js script that would connect to his FTP server and upload the new files (along with some extra checking that the deployment was successful).

Instead of using FTP, I wanted to use rsync (with ssh). I also didn't want to use Node.js, so stuck with bash scripting. I didn't implement any check that the deployment actually worked - although if the build fails the pipeline will stop. I also used Github Secrets in order to store the user, hostname, and ssh key for deployment. I used the available [action-rsync](https://github.com/marketplace/actions/action-rsync) as a baseline for my action, but I wanted to create the entire thing from scratch so I would understand more.

You can see the action definition [in the github for this website](https://github.com/bill-bateman/website/blob/master/.github/workflows/build_and_deploy.yml). I've also annotated a version below.

```yaml
name: BuildAndDeploy

on:
  push:
    branches: [ master ] # runs this script on push to master branch

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest #base docker image

    steps:
      - uses: actions/checkout@v2 #checks out the project code

      - name: Install #step to install npm dependencies and gatsby cli
        run: |
          npm install
          npm install -g gatsby-cli
      
      - name: Build #step to build the website (by default places it in a directory named 'public')
        run: gatsby build
      
      - name: Setup SSH #place the ssh key into an identity file
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
        run: |
          mkdir -p ~/.ssh/
          echo "$DEPLOY_KEY" > ~/.ssh/deploy.key
          chmod 600 ~/.ssh/deploy.key
      
      - name: Deploy
        env:
          LOCAL_BUILD_DIRECTORY: public/ #default build directory of gatsby
          DEPLOY_DIRECTORY_NAME: ${{ secrets.DEPLOY_DIR }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        #rsync options: (see https://linux.die.net/man/1/rsync)
        #  -a archive mode; equals -rlptgoD
        #    -r recurse into directories
        #    -l copy symlinks as symlinks
        #    -p preserve permissions
        #    -t preserve modification times
        #    -g preserve group
        #    -o preserve owner
        #    -D preserve device files and special files
        #  -v increase verbosity
        #  -z compress file data during the transfer
        #  --delete delete extraneous files from the receiving files (ones that aren't on the sending side)
        #  -e allows you to specify any remote shell (i.e. ssh)
        #
        #ssh options:
        #  -i ~/.ssh/deploy.key uses the identify file created in Setup SSH step
        #  -o StrictHostKeyChecking=no is required, as ssh will prompt the user to accept the host key
        #
        run: rsync -avz --delete -e 'ssh -i ~/.ssh/deploy.key -o StrictHostKeyChecking=no' ${LOCAL_BUILD_DIRECTORY} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIRECTORY_NAME}
```