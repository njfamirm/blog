---
title: Create a search endpoint with Custom API in Strapi
description: Learn how to create a custom API in Strapi to search on your reading list.
socialImage: /img/blog/strapi-custom-api/cover.jpg
type:
  - Training
keywords:
  - strapi
---

- clone repo
- create reading list type
- add this function to them!

Hi everyone, in this day i want to explain how can create custom api in strapi for search on reading list!

first simply explain idea, then lets create them and then enjoy this!

## Idea

Every day we read many articles, blog posts and document and learn new things, maybe this is the most important part of **programming life style**!
But unfortunately, we do not save those url anywhere, and even if we keep them on own notes, because it is not accessible through searching, we will not bother anymore.

The interesting idea that I got from <a href="https://esif.dev" target="_blank">esif.dev</a> blog was that you can put these links in something called **`reading-list`** on your website.
This will make others grow along with us, and it also helps us to refer to it later by putting keywords.

So I decided to put a searchable  **`reading-list`** on my website.

## Solution

Since we may read an article several times a day and need to put it in the reading-list, We needed to have CMS, so that I can put the links there very quickly and easily and not think about anything else.
And since this page is supposed to work with an API on my site, there is no need to make it completely static like other pages with 11ty.
I decided to use <a href="https://strapi.io/" target="_blank">Strapi</a> as a beautiful, dynamic and easy CMS.

## Preparing the environment

First, we need to create a new project with the following command:

```bash
yarn create strapi-app reading-list --quickstart
```

## Create Content Type

First, we need to create a content-type that we can put our reading-list in.
We need to type this command and we can do the rest very easily according to our taste.

```bash
yarn strapi generate
```

```txt
  ? Strapi Generators content-type - Generate a content type for an API
  ? Content type display name Reading List
  ? Content type singular name reading-list
  ? Content type plural name reading-lists
  ? Please choose the model type Collection Type
  ? Use draft and publish? No
  ? Do you want to add attributes? Yes
  ? Name of attribute title
  ? What type of attribute string
  ? Do you want to add another attribute? Yes
  ? Name of attribute url
  ? What type of attribute text
  ? Do you want to add another attribute? Yes
  ? Name of attribute description
  ? What type of attribute richtext
  ? Do you want to add another attribute? Yes
  ? Name of attribute keyword
  ? What type of attribute text
  ? Do you want to add another attribute? No
  ? Where do you want to add this model? Add model to new API
  ? Name of the new API? reading-list
  ? Bootstrap API related files? Yes
  ✔  ++ /api/reading-list/content-types/reading-list/schema.json
  ✔  +- /api/reading-list/content-types/reading-list/schema.json
  ✔  ++ /api/reading-list/controllers/reading-list.ts
  ✔  ++ /api/reading-list/services/reading-list.ts
  ✔  ++ /api/reading-list/routes/reading-list.ts
```

this command create base schema, but we can improve this by add regex and unique to url field and also make title and url require, this is result of schema can put under `api/reading-list/content-types/reading-list/schema.json`:

<details>
  <summary>more complex schema</summary>

```json
{
  "kind": "collectionType",
  "collectionName": "reading_lists",
  "info": {
    "singularName": "reading-list",
    "pluralName": "reading-lists",
    "displayName": "Reading List",
    "description": ""
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string",
      "regex": "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
      "required": true,
      "unique": true
    },
    "description": {
      "type": "richtext"
    },
    "keyword": {
      "type": "text",
      "required": false
    }
  }
}
```

</details>

nice, now we can create collection type like this:
{# screenshot #}

## create custom api

now we must create a custom api for search, so again use strapi generate command

```bash
yarn strapi generate
```

```txt
  ? Strapi Generators api - Generate a basic API
  ? API name reading-list
  ? Is this API for a plugin? No
  ✔  ++ /api/reading-list/routes/reading-list.ts
  ✔  ++ /api/reading-list/controllers/reading-list.ts
  ✔  ++ /api/reading-list/services/reading-list.ts
```

## add service

now wa must create a function to first get data from database and then search on them, for this we need create a file in `api/reading-list-search/services/reading-list-search.js` and add this code to them:

```ts
async function search(keyword?: string) {
  try {
    const entries = await strapi.entityService.findMany('api::reading-list.reading-list', {});

    let filteredEntries = entries;
    if (keyword) {
      filteredEntries = entries.filter((entry) => {
        const keywords = entry.keywords.split(',').map((keyword) => keyword.trim());
        return keywords.includes(keyword);
      });
    }

    return filteredEntries;
  } catch (err) {
    return err;
  }
}
```

in this function first we get reading with `findMany` and then filter them with plain typescript!

## add controller

now we must create a controller to call this function, for this we need create a file in `api/reading-list-search/controllers/reading-list-search.js` and add this code to them:

```ts
async function search(ctx, next) {
  try {
    const data = await strapi.service('api::pages-report.pages-report').search(ctx.request.query.keyword);
    ctx.body = data;
  } catch (err) {
    ctx.badRequest('Page report controller error', {moreDetails: err});
  }
}
```

in this function we call service function and then return data to user!

## add route

now we must add route to this api, for this we need add this code to `api/reading-list-search/config/routes.json`:

```json
{
  "method": "GET",
  "path": "/reading-list-search",
  "handler": "reading-list-search.search",
  "config": {
    "policies": []
  }
}
```

## add plugin

now we must add plugin to strapi, for this we need add this code to `config/plugins.js`:

```js

module.exports = ({env}) => ({
  // ...
  custom: {
    'reading-list-search': {
      enabled: true,
      route: '/reading-list-search',
    },
  },
  // ...
});
```

## add to strapi

now we must add this plugin to strapi, for this we need add this code to `config/functions/bootstrap.js`:

```js

module.exports = async () => {
  // ...
  await strapi.registerPlugin({
    plugin: require('../plugins/reading-list-search'),
    config: {
      routes: {
        prefix: '/reading-list-search',
      },
    },
  });
  // ...
};
```

## conclusion

now we can use this api to search on reading list!

## source code
