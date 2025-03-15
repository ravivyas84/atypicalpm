import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// Extend the base Starlight schema to include ogImage
export const collections = {
	docs: defineCollection({ 
		schema: docsSchema({
			extend: z.object({
				// Optional custom OG image path relative to /public
				ogImage: z.string().optional(),
			}),
		}),
	}),
};