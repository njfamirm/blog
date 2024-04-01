---
title: Lorem-ipsum.ir launched!
description: Discover the ultimate Lorem Ipsum generator at lorem-ipsum.ir, a client-side, Jamstack-powered website offering fast, efficient, and user-friendly text generation for your projects. Built with Eleventy!
socialImage: /img/blog/lorem-ipsum-ir-launched/cover.jpg
type:
  - Project
keywords:
  - 11ty
  - jamstack
  - static-site-generator
date: 2023-10-13
---

Hi everyone 🙌🏻

Recently I was looking for a website that would simply generate lorem ipsum text to use in my project. Suddenly I realized a disaster!

<img src="https://cdn.njfamirm.ir/blog/lorem-ipsum-ir-launched/lorem-example.gif" alt="Lorem ipsum website example" loading="lazy" decoding="async" />

A request has been sent to the backend service to generate any lorem text! Unfortunately, this was not the only case, perhaps the best of its kind. At least this website had more features.

After this, I decided to create a lorem ipsum generator website with my friends.

## Why?

Many people have built such a website, yes I know!
But the claim of this project is not that we are the best or that we are something new. It has only tried to improve the same old idea, and of course, the main purpose of this project was education.

## How?

We need to create a website to generate lorem text and copy them to the user's clipboard. **Simply and nothing else!**

But our difference from other websites is that all the work is done in the client (user's browser), So we follow the [Jamstack architecture](https://jamstack.org/what-is-jamstack/){target="_blank"}, The core principles of Jamstack is pre-rendering, and so website need just serve static files on the CDN, without any server-side code. This means that the website is very fast.

So we use [Eleventy](https://www.11ty.dev/){target="_blank"} to build our website. This is a simple, fast and customizable static site generator(SSG), and using Alwatr's 11ty starter-kit called **12fy(11ty++)** for this project, This starter kit uses esbuild to build Typescript/Javascript, postcss to build CSS, and tailwindcss for styling, The combination of different build tools provides a completely optimal output.

## Process

After we have decided what we can use for the project, we need to consider our needs.

On the main page, we need a toolbox to generate lorem text, which includes the following:

- A segmented button for lorem type, paragraph, sentence and keyword.
- A segmented button for number of lorem text.
- A texture to display the lorem text.
- A button to copy the text to the clipboard.

At the bottom of the page, a simple text and image to explain what Ipsum lorem is, this is good for search engine optimization.

And this is the result:
![lorem-ipsum.ir page speed result](assets/img/blog/lorem-ipsum-ir-launched/lorem-toolbox.jpg)

Next we need to add some JavaScript code to make the toolbox dynamic. This is where the Jamstack architecture differs. We use JSON to store lorem text in them with 3 keys, paragraph, sentence and keyword. which can be seen in this [json file](https://github.com/njfamirm/lorem-ipsum.ir/blob/4dae42acae87f1d4a316a18dcd8709422146f99c/site/_js/data/lorem-ipsum-fa.json){target="_blank"}. This json bundled in our js code and do not additional request sent for it in client.

Then, write js code to generate the text and place it in the textarea of the toolbox, based on the user input from the segmented buttons. And at the end we add an event listener for the copy button to copy the text to the clipboard. And that's it ⚡️

## Result

Is Done 🎉, and this is [Page Speed result](https://pagespeed.web.dev/analysis/https-lorem-ipsum-ir/sacu27g5cb?form_factor=mobile):

![lorem-ipsum.ir page speed result](assets/img/blog/lorem-ipsum-ir-launched/result.jpg)

**Check out the live version of this project at [lorem-ipsum.ir](https://lorem-ipsum.ir){target="_blank"} and enjoy it. Also view the source code of this project on [GitHub](https://github.com/njfamirm/lorem-ipsum.ir){target="_blank"}**

## Future

The main process of the website is done, in the next step we want to:

- Add more languages, especially English
- Add more lorem like text.
- Lorem random text.
- and more ...

All task is on [Github Project](https://github.com/users/njfamirm/projects/6/views/1){target="_blank"} and you can see them. contributing is welcome ❤️.

## Thanks

- You for reading this post.
- [Sajjad Siadati](https://github.com/SMsajjadSM){target="_blank"}, [Amir Hossein Abbasi](https://github.com/AmirHosseinAbbasii){target="_blank"} for contributing in this website.
- [Jamstack](https://jamstack.org/){target="_blank"} for this amazing architecture.
- [Eleventy](https://www.11ty.dev/){target="_blank"} for this amazing static site generator.
- [Alwatr](https://github.com/alwatr){target="_blank"} for this amazing starter kit.

## Conclusion

I hope you enjoyed this post, if you have any questions or suggestions, please let me in twitter [@njfamirm](https://twitter.com/njfamirm){target="_blank"} know.
