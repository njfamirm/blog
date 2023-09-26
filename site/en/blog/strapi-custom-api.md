---
title: Creating a Searchable Reading List with Strapi CMS Custom API
description: In this article, one of our big problems is investigated and to solve it, we create a reading-list with Strapi and make them searchable with Strapi custom API.
socialImage: /img/blog/strapi-custom-api/cover.jpg
type:
  - Training
keywords:
  - strapi
  - idea
---

Hi everyone!

As programmers, we are constantly learning and reading articles, blog posts, and documentation. Maybe this is the most important part of **programming lifestyle**!
Unfortunately, we do not keep those resource anywhere, and even if we keep them on our notes because it is not accessible through searching, we can't access them anymore.

## Idea

An interesting solution for our problem is a **`searchable reading list`** that's I got this idea from the <a href="https://esif.dev" target="_blank">esif.dev</a> blog.

At the end, you can setup and maintain a **`searchable-reading-list`** of valuable resources that you encounter during your programming journey!

## Roadmap

Since we may read several articles in a day and need to put it in the reading-list, We needed to have a CMS, so that I could put the links there very quickly and easily and not think about anything else.

Also, our reading list page should work with the API and not need to be built statically like other pages with <a href="https://www.11ty.dev/" target="_blank">Eleventy</a>. So I decided to use <a href="https://strapi.io/" target="_blank">Strapi</a> as a beautiful, dynamic, and easy-to-use CMS.

## Preparing the environment

Before we can start building our reading-list, we need to create a new Strapi project.

```bash
yarn create strapi-app reading-list --ts
```

## Create Content Type

First, we need to create a content-type that we can put our reading-list in, So to create a content type for our reading-list, we can use the Strapi CLI and run the following command in our project directory. This will generate a new content type with the specified name and fields.

This command will create a new content type called reading-list and generate the necessary files and fields to get started building our custom API.

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
    This is a base schema, but we can improve them by adding regex and unique to the url field and also making the title and the url required, this is result of the schema can put under api/reading-list/content-types/reading-list/schema.json:
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

{% image "/img/blog/strapi-custom-api/content-type.jpg", "Screenshot of strapi content type" %}

Very good, Now we have simple reading list in strapi, let's make them searchable!

## Search Custom API

In this step we'll use the strapi-generate command again to creates a custom API pure file structure.

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

Now we need to fill the files with the correct codes.

## Service

Services are a set of reusable functions to simplify controllers' logic. <sup> <a href="https://docs.strapi.io/dev-docs/backend-customization/services" target="_blank">ReadMore</a></sup>

In this step, we use the service to create a function to get the reading list and filter them. The keyword parameter is used to filter the reading-list based on their keywords, and if no keyword is given, it returns all content of reading-list.

`api/reading-list-search/services/reading-list-search.js`:

```ts
import {errors} from '@strapi/utils';

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
    throw new errors.ApplicationError('Something went wrong');
  }
}

export default {search};
```

this function first gets reading-list with [findMany](https://docs.strapi.io/dev-docs/api/entity-service/crud#findmany) and then filters them using the typescript filter function.

## Controller

Controllers contain a set of methods, called actions, reached by the client according to the requested route. <sup> <a href="https://docs.strapi.io/dev-docs/backend-customization/controllers" target="_blank">ReadMore</a></sup>

To write a controller for the reading-list search function, set the content of the `api/reading-list-search/controllers/reading-list-search.js` file something like this to pass keyword search query into search service function.

```ts
async function search(ctx) {
  try {
    return await strapi.service('api::reading-list-search.reading-list-search').search(ctx.request.query.keyword);
  } catch (err) {
    ctx.badRequest('Reading list search controller error', {detail: err});
  }
}

export default {search};
```

## Route

Requests sent to Strapi on any URL are handled by routes. <sup> <a href="https://docs.strapi.io/dev-docs/backend-customization/routes" target="_blank">ReadMore</a></sup>

We must add this endpoint and sets the previous controller as the route handler, put this code to `api/reading-list-search/routes/reading-list-search.ts`:

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

Now this route is accessible at <a href="http://localhost:1337/api/reading-list-search" target="_blank">/api/reading-list-search</a>, of course if we do the next step 🤓!

## Set Permission

By default, this API can't be accessible publicly so set the correct permission.

{% image "/img/blog/strapi-custom-api/api-permission.jpg", "Screenshot of set permission for strapi custom API" %}

## Result

Congratulations 🎉, we create a custom API for searching in our reading-list using Strapi CMS.

{% image "/img/blog/strapi-custom-api/api-result.jpg", "Screenshot of reading list custom API response" %}

I hope this article is useful for you, and it is a step towards a society where we grow together ♥️

<hr class="m-10" />

Thanks [@derrickmehaffy](https://github.com/derrickmehaffy) for improve this article.
