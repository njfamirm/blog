---
title: A Step-by-Step Guide to Self-Hosting Decap CMS
description: Simple guide to host Decap CMS backend on your own server.
socialImage: /img/blog/self-hosting-decap-cms/cover.jpg
type:
  - Training
keywords:
  - decap-cms
  - self-hosting
---

Hi everyone!
In this article, I'll show you how to host your own Decap CMS _(former Netlify-CMS)_ backend without the need for another external service.

By the end of this article, you will be able to host Decap CMS and have a fully functional content management system that you can use to build your website or blog.

Let's start

## Create OAuth Application

To create an OAuth application, you will need to:

1. Go to the [Github OAuth settings](https://github.com/settings/applications/new) from `Settings > Developer Settings > OAuth Apps > Generate New`
2. In the Application name field, enter a name for your application.
3. In the Homepage URL field, enter the URL of your website.
4. In the Authorization callback URL field, enter the URL that will be redirected to after authentication. This URL will depend on your Decap CMS backend. In this post, we will set the callback URL to _**${siteURL}/callback**_.

Once you have entered all of the required information, click Create Application.

{% image "/img/blog/self-hosting-decap-cms/create-oauth-screenshot.jpg", "Create Oauth app on Github for Decap CMS" %}

Then when the application is created, save the `Client ID` and create new `Client secrets` for use in the last step.

{% image "/img/blog/self-hosting-decap-cms/oauth-setting-screenshot.jpg", "Create client ID and secret ID in Github OAuth app" %}

### Add CMS to the Website

First, you must install Decap-CMS:

```sh
yarn add netlify-cms-app
# yarn add netlify-cms-app
```

Then add admin html and javascript/typescript file like below:

`admin.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Website | Admin Panel</title>
  </head>
  <body>
    <script type="module" src="admin.js"></script>
  </body>
</html>
```

`admin.js`

```js
import CMS from 'netlify-cms-app';

CMS.init();
```

> If you're using Hugo, to add an admin panel to the `/admin` address, you can add `admin/_index.md` to the `content` folder and also `_default/admin.html` to `layouts`.

To speed up load time you can use a Javascript bundler to minify and treeshake the `netlify-cms-app` package.

## Setup Backend

Based Decap-CMS [documentation](https://decapcms.org/docs/external-oauth-clients/)
you can use an external OAuth client.
I'm testing [ublabs/netlify-cms-oauth](https://github.com/ublabs/netlify-cms-oauth) with vercel and this work correctly, but our goal was to run on our own servers, not on another PaaS! so I'm rewriting this to run with NodeJS with packages I was using! and publish them to [decap-cms-github-backend](https://github.com/njfamirm/decap-cms-github-backend), this repo also publishes a docker image of Decap CMS GitHub backend to `ghcr.io`, so we can use this to deploy own backend!

Now you can add a docker image into your deployment process with this envs:

```toml
CMS_GITHUB_BACKEND_IMAGE='ghcr.io/njfamirm/decap-cms-github-backend:main'

OAUTH_GITHUB_CLIENT_ID='your_oauth_github_client_id'
OAUTH_GITHUB_CLIENT_SECRET='000_your_oauth_github_client_id_000'

# Enable debug logging
# CMS_BACKEND_DEBUG=1
```

and docker compose like this:

```yaml
services:
  cms-backend:
    image: ${CMS_BACKEND_IMAGE}

    restart: unless-stopped

    environment:
      - OAUTH_GITHUB_CLIENT_SECRET=${OAUTH_GITHUB_CLIENT_SECRET}
      - OAUTH_GITHUB_CLIENT_ID=${OAUTH_GITHUB_CLIENT_ID}
      - ALWATR_DEBUG=${CMS_BACKEND_DEBUG-}
```

## Setup Admin config

Amazing, almost all thing is done, just need to add Decap-CMS into the admin `config.yml` file like this:

```yaml
backend:
  name: github
  branch: main
  repo: njfamirm/amazing-oauth
  base_url: https://auth.amazing-oauth.name/
```

now when you deploy the backend, can login by going to the `https://amazing-oauth.name/admin` page and get access to the CMS to push commit, create and merge PR in your repo!

**Enjoy like a freed bird from the cage ✌🏻💎**

I hope this article was useful for you!
