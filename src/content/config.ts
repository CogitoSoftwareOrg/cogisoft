import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.date(),
      authors: z.array(z.string()).optional(),
      avatars: z.array(image()).optional(),
      image: image().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};
