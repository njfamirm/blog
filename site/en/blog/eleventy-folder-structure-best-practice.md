---
title: 'Eleventy Mastery: Real-World Tips for Efficient Folder Structure'
description: Learn how to organize your Eleventy project for maximum efficiency and maintainability.
socialImage: /img/blog/git-separate/cover.jpg
type:
  - Training
keywords:
  - eleventy
  - jamstack
  - static-site-generator
  - best-practice
  - web
---

## Introduction

## Understanding the Default Eleventy Folder Structure

in the eleventy the default folder structure is:

- input: .
- includes: _includes
- layouts: same as includes
- data: _data
- output: _site

so simple, but is it the best?
If you want to build simple and fun project, you can close this page and start your project. but if you want to build a real project, you need to customize the folder structure.

## The Importance of a Customized Folder Structure

first of all I'm congratulating you to have a real-word project :D

the basic and default folder structure in eleventy useful if you want start simple project without technical support or you want to learn the eleventy.
but when you want to build a real project you need to customize the folder structure. not just for rename the folder but useful for Separation of Concerns (SoC) and Single Responsibility Principle (SRP). and also you can use the folder structure for performance optimization.

After you create a large project with many pages, styles, script and content, you will find that the default folder structure is not enough. you need to customize the folder structure to make your project more maintainable and efficient.

## Separation of Concerns (SoC)

11ty is a good static site generator that's we use them for out template engine and build our html of our website, but css and js is not the part of 11ty. so we need to separate them from 11ty.

I our projects we use esbuild for build tool for js and postcss for css. so we need to separate them from 11ty.

each of them have their custom watch folder system and we need to separate them from 11ty.

### Input and Output Folders

First of all I'm prefer to change the default folder structure input and output. I'm prefer to use site for input and dist for output. because I'm use this folder structure for all of my projects. and I'm use this folder structure for all of my projects. of course this part is no part of the Soc, but dist is a common folder name for output, for input folder you can also use src or app.

```bash
├── dist
└── site
```

### Includes and Layouts

in the eleventy, includes and layouts folder is the same. but I'm prefer to separate them. and based `Singular naming conversation`, I'm prefer to remove s from folder name, you can read more about this in [this article]().

So I'm prefer to use include and layout folder.

I'm prefer to use `_` for folder name that I'm not want to generate html file for them. so I'm prefer to use `_include` and `_layout` for them.

```bash
├── dist
├── site
│   ├── _include
│   └── _layout
```

### Data Folder

nothing to change here!

```bash
├── dist
└── site
│   ├── _include
│   └── _layout
│   └── _data
```

### Assets Folder

Assets part of the SoC, so we need to separate them from 11ty. I'm prefer to use `assets` folder outside of the site folder.

```bash
├── dist
└── site
│   ├── _include
│   └── _layout
│   └── _data
└── assets
```

### Styles Folder

Because we use postcss for our css, we need to separate them from 11ty. I'm prefer to use `_style` folder inside of the site folder. if you want to just copy your css file to dist folder, you can put css into assets folder.

```bash
├── dist
└── site
│   ├── _include
│   └── _layout
│   └── _data
│   └── _style
└── assets
```

### Scripts Folder

Because we use esbuild for our js, we need to separate them from 11ty. I'm prefer to use `_script` folder inside of the site folder. if you want to just copy your js file to dist folder, you can put js into assets folder.

```bash
├── dist
└── site
│   ├── _include
│   └── _layout
│   └── _data
│   └── _style
│   └── _script
└── assets
```

### Content Folder

Content part of the SoC, so we need to separate them from 11ty. I'm prefer to use `content` folder inside of the site folder.

```bash
├── dist
└── site
│   ├── _include
│   └── _layout
│   └── _data
│   └── _style
│   └── _script
│   └── content
└── assets
```

### 11ty config

after you separate the folder, you need to change the 11ty config file. you can use this config file:

```js
module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "site",
      output: "dist",
      includes: "_include",
      layouts: "_layout",
      data: "_data",
    },
  };
};
```

## Performance Optimization Through Folder Structure

After separating each folder, you can set watch for each folder. for example you can set watch for `_style` folder and when you change the css file, the postcss will build the css file and put it into dist folder. and you can set watch for `_script` folder and when you change the js file, the esbuild will build the js file and put it into dist folder.

## Conclusion

## Further Reading and Resources
