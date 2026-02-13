import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.njfamirm.ir';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic blog posts (English only)
  const blogDir = path.join(process.cwd(), 'content/blog');
  const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  const blogPosts: MetadataRoute.Sitemap = blogFiles.map(filename => {
    const filePath = path.join(blogDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const slug = filename.replace(/\.md$/, '');
    
    return {
      url: `${baseUrl}/en/blog/${slug}`,
      lastModified: data.date ? new Date(data.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...blogPosts];
}
