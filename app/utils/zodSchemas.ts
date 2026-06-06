import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1).max(35),
  description: z.string().min(1).max(150),
  subdirectory: z.string().min(1).max(40),
});

export const articleSchema = z.object({
  title: z.string().min(1).max(80),
  smallDescription: z.string().min(1).max(180),
  image: z.string().trim().optional(),
  articleContent: z.string().min(1),
  published: z.preprocess((value) => value === "on" || value === "true", z.boolean()),
});
