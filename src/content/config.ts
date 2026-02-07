import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// Extend the base Starlight schema to include custom frontmatter fields
export const collections = {
	docs: defineCollection({
		schema: docsSchema({
			extend: z.object({
				// Optional custom OG image path relative to /public
				ogImage: z.string().optional(),
				// Optional publish date for JSON-LD (ISO 8601 string, e.g. "2025-01-15")
				datePublished: z.string().optional(),
			}),
		}),
	}),
};