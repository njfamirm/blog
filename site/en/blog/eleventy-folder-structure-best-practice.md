---
title: 'Mastering Eleventy Folder Structures: From Default Setups to Real-World Best Practices'
description: "Explore the essentials of Eleventy's folder structure in this guide, perfect for optimizing your project's efficiency and scalability. Learn from basic setups to advanced custom structures, ensuring your Eleventy site is perfectly organized for peak performance."
socialImage: /img/blog/eleventy-folder-structure-best-practice/cover.jpg
type:
  - Training
keywords:
  - eleventy
  - jamstack
  - static-site-generator
  - best-practice
  - web
date: 2024-01-24
---

## Introduction

Welcome to the exciting world of Eleventy, a powerful and flexible static site generator based on jamstack! Whether you're a seasoned developer or just starting out, understanding how to effectively organize your Eleventy project is crucial for efficiency and scalability. In this guide, we'll embark on a journey from the simplicity of Eleventy's default folder structure to the sophistication of a customized setup tailored for more complex projects.

## In-Depth Look at Eleventy's Basic Setup

Eleventy, known for its simplicity and flexibility, starts users off with a straightforward folder structure. This design is particularly appealing to beginners or those looking to quickly set up a static site without the complexity often associated with such setups. Let's delve deeper into each component of this default structure:

**1. Input: `.` (Current Directory)**  
   The input directory is denoted by a dot (`.`), representing the current directory where the Eleventy command is run. This approach means that all the files and subdirectories within this directory are considered part of your project's source. It simplifies the process by not requiring a specific folder for your source files, allowing Eleventy to work with your project's root directory directly.

**2. Includes: `_includes`**  
   The `_includes` directory is where Eleventy looks for templating parts – reusable pieces of your templates, like headers, footers, and navigation bars. This feature is crucial for avoiding repetition, as it allows you to maintain consistent elements across various parts of your website easily. By default, Eleventy treats this folder as the go-to place for these template snippets, helping you to organize your project better.

**3. Layouts: Mirrors `_includes`**  
   In Eleventy's default setup, layouts are often placed in the same `_includes` directory. Layouts are essentially templates that define the structure of a webpage. By placing layouts in the `_includes` folder, Eleventy offers a streamlined approach, keeping all template-related files in one location. However, as projects grow, some developers prefer to separate layouts into their own directory for clearer distinction and organization.

**4. Data: `_data`**  
   The `_data` folder is a powerful feature in Eleventy. It's used for storing global data files that can be accessed by any template across the site. This could include site metadata, configuration settings, or any other data that needs to be available site-wide. The data in these files can be written in various formats like JSON, JavaScript, or YAML, providing flexibility in how you manage your site's content and settings.

**5. Output: `_site`**  
   Finally, the `_site` directory is the default output location where Eleventy generates the final, built version of your site. After running Eleventy, this folder contains the HTML, CSS, JavaScript, and other assets that make up your website, ready to be deployed to a web server. This separation of source and output is critical for maintaining a clean workspace, ensuring that your development files are kept separate from the deployable, built site.

Here’s the visual representation of this structure for better clarity:

```txt
├── _data        # Global data files
├── _includes    # Template parts and layouts
├── .            # Main input directory (root of your project)
└── _site        # Output directory for the built website
```

Understanding this default structure is key to getting started with Eleventy. It offers a balance of simplicity and organization, making it an ideal starting point for building static websites. As you grow more familiar with Eleventy, you may find ways to customize this structure to better suit the needs of more complex projects.

## Advantages of the Default Setup

This structure is ideal for small projects and beginners due to its simplicity. It allows developers to quickly get accustomed to Eleventy without overwhelming them with complexity.

## Implementing a Real-World Advanced Folder Structure

As projects grow in size and complexity, the default structure may start to feel limiting. A more sophisticated approach becomes necessary to manage a larger number of files, diverse content types, and more complex build processes.

## Implementing a Real-World Advanced Folder Structure with a Focus on Separation of Concerns (SoC)

When embarking on larger and more complex projects in Eleventy, adhering to the principles of Separation of Concerns (SoC) becomes essential. The default folder structure, while straightforward, often falls short in efficiently handling the growing needs of sophisticated web applications. This is where a tailored, advanced folder structure, guided by the SoC principle, plays a crucial role.

### The Principle of Separation of Concerns (SoC)

Separation of Concerns is a design principle for separating a computer program into distinct sections, such that each section addresses a separate concern or aspect of the software's functionality. In the context of web development and Eleventy projects, SoC translates into organizing your project's files and folders in a way that each type of file or functionality is managed independently. This approach enhances readability, maintainability, and scalability of the project. [Wikipedia](https://en.wikipedia.org/wiki/Separation_of_concerns){target="_blank"} offers a more in-depth explanation of this principle.

### Rethinking Input and Output

- **Input (`site`)**: Shifting from the current directory to a dedicated `site` folder offers better organization and clarity.
- **Output (`dist`)**: Using `dist` for the output directory is a common practice in web development, clearly distinguishing the build output.

### Organizing Templates and Layouts

Separating includes and layouts into `_include` and `_layout` provides a clearer distinction between partial templates and full-page layouts, enhancing maintainability.

### Optimizing Data Management

No changes are needed to the `_data` folder, as it's already well-organized and optimized for global data management.

### Managing Assets

An `assets` folder, placed outside the `site` directory, streamlines the management of static files like images and fonts.

### Styles and Scripts

- **Styles (`_style`)**: A dedicated folder for CSS, particularly when using PostCSS, keeps stylesheets organized.
- **Scripts (`_script`)**: Similarly, a separate folder for JavaScript/Typescript, especially with esbuild integration, ensures a clean separation from other content.

Here's how your advanced Eleventy folder structure should look:

```bash
├── dist                   # Output folder
└── site                   # Main input folder
    ├── _include           # Partial templates
    ├── _layout            # Page layouts
    ├── _data              # Global data files
    ├── _style             # CSS files
    └── _script            # JavaScript/Typescript files
└── assets                 # Static resources
```

## Conclusion

Adopting an advanced folder structure in Eleventy is more than just reorganizing files; it's about setting the stage for scalability, efficiency, and future growth. As you transition from the default setup to a more customized structure, you'll find your projects becoming more manageable and your workflow more streamlined. Embrace this evolution, and watch your Eleventy projects reach new heights of professionalism and capability.
