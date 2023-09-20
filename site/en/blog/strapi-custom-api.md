---
title: Create a search endpoint with Custom API in Strapi
description: Learn how to create a custom API in Strapi to search on your reading list.
socialImage: /img/blog/strapi-custom-api/cover.jpg
type:
  - Training
keywords:
  - strapi
  - idea
---

Hi everyone!

Every day we read many articles, blog posts, and documents and learn new things, maybe this is the most important part of **programming lifestyle**!
Unfortunately, we do not save those url anywhere, and even if we keep them on our notes because it is not accessible through searching, we will not bother anymore.

The interesting idea that I got from <a href="https://esif.dev" target="_blank">esif.dev</a> blog was that you can put these links in something called **`reading-list`** on your website.
This will make others grow along with us, and it also helps us to refer to it later by putting keywords or tags.

So I decided to put a searchable **`reading-list`** on my website and in this article I want to talk about them.

## Solution

Since we may read an article several times a day and need to put it in the reading-list, We needed to have CMS, so that I can put the links there very quickly and easily and not think about anything else.

Since this page is supposed to work with an API on my site, there is no need to make it completely static like other pages with 11ty.

I decided to use <a href="https://strapi.io/" target="_blank">Strapi</a> as a beautiful, dynamic and easy CMS.

## Preparing the environment

First, we need to create a new project with the following command:

```bash
yarn create strapi-app reading-list
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
  ? What type of attribute string
  ? Do you want to add another attribute? Yes
  ? Name of attribute keyword
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

<details>
  <summary>
    This command creates the base schema, but we can improve this by adding regex and unique to url field and also making title and url requires, this is result of the schema can put under api/reading-list/content-types/reading-list/schema.json:
  </summary>

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
{% image "/img/blog/strapi-custom-api/content-type.jpg", "Screenshot of strapi content type" %}

## Search Create Custom API

now we must create a strapi custom API for search in the reading list, so we'll use again strapi generate command again:

```bash
yarn strapi generate
```

```txt
  ? Strapi Generators api - Generate a basic API
  ? API name reading-list-search
  ? Is this API for a plugin? No
  ✔  ++ /api/reading-list-search/routes/reading-list-search.ts
  ✔  ++ /api/reading-list-search/controllers/reading-list-search.ts
  ✔  ++ /api/reading-list-search/services/reading-list-search.ts
```

this command creates a pure file structure of custom API in strapi folders.

## Service handler

Services are a set of reusable functions. They are particularly useful to respect the "don’t repeat yourself" (DRY) programming concept and to simplify controllers' logic. <sup> [Documenting](https://docs.strapi.io/dev-docs/backend-customization/services) </sup>

We use service in this step we create a function to get the reading list and filter them.

`api/reading-list-search/services/reading-list-search.js`:

```ts
async function search(keyword?: string) {
  try {
    const entries = await strapi.entityService.findMany('api::reading-list.reading-list', {});

    let filteredEntries = entries;
    if (keyword) {
      filteredEntries = entries.filter((entry) => {
        const keywords = entry.keyword.split('\n').map((keyword) => keyword.trim());
        return keywords.includes(keyword);
      });
    }

    return filteredEntries;
  } catch (err) {
    return err;
  }
}

export default {search};
```

in this function first, we get reading with [findMany](https://docs.strapi.io/dev-docs/api/entity-service/crud#findmany) and then filter them using the filter function.

## Controller

Controllers are JavaScript files that contain a set of methods, called actions, reached by the client according to the requested route. <sup> [Documenting](https://docs.strapi.io/dev-docs/backend-customization/controllers) </sup>

now we must create a controller to call this function, this we need to create a file in `api/reading-list-search/
controllers/reading-list-search.js` and add this code to them:

```ts
async function search(ctx, _) {
  try {
    const data = await strapi.service('api::reading-list-search.reading-list-search').search(ctx.request.query.keyword);
    ctx.body = data;
  } catch (err) {
    ctx.badRequest('Reading list search controller error', {moreDetails: err});
  }
}

export default {search};
```

in this function, we call the service function and then return data to the user!

## Route

Requests sent to Strapi on any URL are handled by routes. <sup> [Documenting](https://docs.strapi.io/dev-docs/backend-customization/routes) </sup>

now we must add a route to this API, for this we need to add this code to `api/reading-list-search/config/routes.json`:

```ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/reading-list-search',
      handler: 'reading-list-search.search',
      config: {
        policies: [],
      },
    },
  ],
};
```

## Set Permission

by default, this API can't be accessible publicly so must set the correct permission.

{% image "/img/blog/strapi-custom-api/api-permission.jpg", "Screenshot of set permission for strapi custom API" %}

## Result

Congratulations, we managed to create a custom API for searching our reading list using Strapi CMS.

{% image "/img/blog/strapi-custom-api/api-result.jpg", "Screenshot of reading list custom API response" %}
