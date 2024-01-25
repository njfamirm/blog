---
title: 'Mastering Eleventy Folder Structures: From Default Setups to Real-World Best Practices'
description: "Explore the essentials of Eleventy's folder structure in this guide, perfect for optimizing your project's efficiency and scalability. Learn from basic setups to advanced custom structures, ensuring your 11ty site is perfectly organized for peak performance."
socialImage: /img/blog/eleventy-folder-structure-guide/cover.jpg
type:
  - Training
keywords:
  - eleventy
  - jamstack
  - static-site-generator
  - best-practice
date: 2024-01-24
---

## Introduction

Welcome to the exciting world of [Eleventy](https://www.11ty.dev/){target="_blank"}, a powerful and flexible static site generator based on jamstack! Whether you're a seasoned developer or just starting out, understanding how to effectively organize your Eleventy project is crucial for efficiency and scalability. In this guide, we'll embark on a journey from the simplicity of Eleventy's default folder structure to the sophistication of a customized setup tailored for more complex projects.

## In-Depth Look at Eleventy's Basic Setup

Eleventy, known for its simplicity and flexibility, starts users off with a straightforward folder structure. This design is particularly appealing to beginners or those looking to quickly set up a static site without the complexity often associated with such setups. Let's delve deeper into each component of this default structure:

### 1. Input

The input directory is the current directory where the Eleventy command is run. This approach means that all the files and subdirectories within this directory are considered part of your project's source. It simplifies the process by not requiring a specific folder for your source files, allowing Eleventy to work with your project's root directory directly.

### 2. Includes

The `_includes` directory is where Eleventy looks for templating parts – reusable pieces of your templates, like headers, footers, and navigation bars. This feature is crucial for avoiding repetition, as it allows you to maintain consistent elements across various parts of your website easily. By default, Eleventy treats this folder as the go-to place for these template snippets, helping you to organize your project better. this folder where is you can use the `include` tag to include a template part in another template.

### 3. Layouts

In Eleventy's default setup, [layouts](https://www.11ty.dev/docs/layouts/){target="_blank"} are often placed in the same `_includes` directory. Layouts are essentially templates that define the structure of a webpage. By placing layouts in the `_includes` folder, Eleventy offers a streamlined approach, keeping all template-related files in one location. However, as projects grow, some developers prefer to separate layouts into their own directory for clearer distinction and organization.

### 4. Data

The `_data` folder is a powerful feature in Eleventy. It's used for storing [Global Data](https://www.11ty.dev/docs/data-global/){target="_blank"} files that can be accessed by any template across the site. This could include site metadata, configuration settings, or any other data that needs to be available site-wide. The data in these files can be written in various formats like JSON, JavaScript, or YAML, providing flexibility in how you manage your site's content and settings.

### 5. Output

Finally, the `_site` directory is the default output location where Eleventy generates the final, built version of your site. After running Eleventy, this folder contains the HTML, CSS, JavaScript, and other assets that make up your website, ready to be deployed to a web server or CDN. This separation of source and output is critical for maintaining a clean workspace, ensuring that your development files are kept separate from the deployable, built site.

Here’s the visual representation of this structure:

```bash
├── .            # Main input directory (root of your project)
├── _data        # Global data files
├── _includes    # Template parts and layouts
└── _site        # Output directory for the built website
```

Understanding this default structure is key to getting started with Eleventy. It offers a balance of simplicity and organization, making it an ideal starting point for building static websites. As you grow more familiar with Eleventy, you may find ways to customize this structure to better suit the needs of more complex projects.

## Implementing a Real-World Advanced Folder Structure

In the ever-evolving world of web development, Eleventy projects often outgrow their initial folder structures, revealing the need for a more sophisticated organization as they expand in complexity and size. This progression necessitates a refined approach to effectively handle a growing array of files, diverse content types, and the nuances of complex build processes. Embracing an advanced folder structure, fundamentally grounded in the Separation of Concerns (SoC) principle, becomes critical.

> 💡 **Separation of Concerns**: This pivotal design principle involves dividing a computer program into distinct sections, each focusing on a unique aspect of the software's functionality. Applied to web development and particularly Eleventy projects, SoC means organizing files and folders to independently manage each type of file or functionality. This strategic compartmentalization significantly boosts a project's readability, maintainability, and scalability. For a detailed exploration of SoC, [Wikipedia](https://en.wikipedia.org/wiki/Separation_of_concerns){target="_blank"} provides extensive insights.

Crucially, in implementing this structure, remember that the essence lies in the functional separation of the folders rather than their specific names. Folder names can vary widely based on individual preferences or project requirements, underscoring the importance of a tailored approach to folder organization in Eleventy projects.

### Rethinking Input and Output

**Input**: Shifting from the current directory to a dedicated `/site` folder offers better organization and clarity.
**Output**: Using `/dist` for the output directory is a common practice in web development, clearly distinguishing the build output.

### Organizing Templates and Layouts

Refining the structure by distinguishing includes and layouts into separate folders, namely `site/_include` for partial templates and `site/_layout` for full-page layouts, greatly clarifies their distinct functions. This separation not only enhances the maintainability of the project but also brings a clear organizational hierarchy. Additionally, I employ a `_` prefix for all folders that exclusively house templates or similar non-content elements, further streamlining the folder structure for efficient project navigation and management.

### Optimizing Data Management

No changes are needed to the `site/_data` folder, as it's already well-organized and optimized for global data management.

### Managing Assets

An `asset` folder, placed outside the `site` directory, streamlines the management of [static files](https://www.11ty.dev/docs/assets/){target="_blank"} like images and fonts.

### Styles and Scripts

**Styles**: A dedicated folder for CSS at `/style`, particularly when using CSS transformer, keeps stylesheets organized.
**Scripts**: Similarly, a separate folder for EcmaScript at `/es`, especially with ES builder integration, ensures a clean separation from other content.

### Shortcodes and Filters

[Shortcodes](https://www.11ty.dev/docs/shortcodes/){target="_blank"} and [Filters](https://www.11ty.dev/docs/filters/){target="_blank"} significantly enhance Eleventy's templating capabilities, offering custom functionality and dynamic content processing. To maintain an organized codebase, it's best practice to store these tools in a designated `/scripts` folder. This not only segregates them from your main content but also centralizes all script-related utilities in one place for ease of management and maintenance.

Here's how your advanced Eleventy folder structure should look:

```bash
├── dist            # Output folder
├── scripts         # Shortcodes, filters, and other scripts for Eleventy
├── style           # CSS files
├── es              # Ecmascript files
├── asset           # Static resources
└── site            # Main input folder
    ├── _include    # Partial templates
    ├── _layout     # Page layouts
    └── _data       # Global data files
```

This is pure example of advanced folder structure, you can customize subfolder as you want.

## Conclusion

Adopting an advanced folder structure in Eleventy is more than just reorganizing files; it's about setting the stage for scalability, efficiency, and future growth. As you transition from the default setup to a more customized structure, you'll find your projects becoming more manageable and your workflow more streamlined. Embrace this evolution, and watch your Eleventy projects reach new heights of professionalism and capability.
