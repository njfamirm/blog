---
permalink: false
eleventyExcludeFromCollections: true
title: A Step-by-Step Guide to Self-Hosting Decap CMS without Netlify
description: Learn to self-host the Decap CMS backend, formerly Netlify-CMS, without relying on external services. This step-by-step guide simplifies setting up a git-based CMS for static site generators, perfect for those seeking an independent and streamlined content management system.
socialImage: /img/blog/self-hosting-decap-cms/cover.jpg
type:
  - Training
keywords:
  - decap-cms
  - netlify-cms
  - self-hosting
  - oauth
date: 2023-08-18
---

- install git
- install nodejs binary from website: <https://nodejs.org/en/download/current>

```
cd

remove any node/yarn on your system using `where yarn/node`

# install 1bash
export ONE_BASH="$HOME/1bash"
export ONE_BASH_REPO_URL="https://github.com/Alwatr/1bash"
export ONE_BASH_REF="feat/customize"
bash <(curl -s "https://raw.githubusercontent.com/Alwatr/1bash/feat/customize/setup.sh")

mkdir .node/vX
mv ~/Downloads/node-binary .node/vX

# put this in bashrc
export NODE_BIN="$HOME/.node/v${NODE_VERSION:-21}/bin"
if [ -d $NODE_BIN ]
then
  export PATH="$PATH:$NODE_BIN"
  # export NODE_OPTIONS="--max-old-space-size=4096"
else
  echoError "Setup node error! '$NODE_BIN' not exist!"
fi

install yarn using: https://yarnpkg.com/getting-started/install

setup git: https://docs.github.com/en/get-started/getting-started-with-git/set-up-git
```
