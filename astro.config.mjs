import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://atypicalpm.com/',
    integrations: [starlight({
        title: 'Atypical Product Manager',
        pagination: false,
        head:[
            {
                tag:'script',
                attrs:{
                    src: 'https://umami.ravivyas.com/script.js',
                    'data-website-id': 'bd7c10ec-6a47-4cd2-9a37-32e6ff3c4fda',
                    defer:true
                },
            }],
        social: {
            github: 'https://github.com/ravivyas84/atypicalpm',
        },
        // components: {
  //   // Override the default `SocialIcons` component.
  //   Footer: './src/components/footer.astro',
  // },
        sidebar: [
            {
                label: 'Meta',
                autogenerate: { directory: 'meta' },
            },
            {
                label: 'What is Product Management',
                items: [
                    'what-is-pm/what-is',
                    {
                        label: 'My Definitions',
                        items: [
                            'what-is-pm/my-definitions/right-x',
                            'what-is-pm/my-definitions/value-driver',
                            'what-is-pm/my-definitions/problem-solving-function'
                        ],
                    },
                    {
                        label: 'Popular Definitions',
                        items: [
                            'what-is-pm/popular-definitions/shape-up'
                        ],
                    },
                    {
                        label: 'What Product Management is not',
                        items: [
                            'what-is-pm/what-pm-is-not/idea-generator'
                        ],
                    }]
                },
                {
                    label: 'Product Management Skills',
                    items: [
                        'pm-skills/skills',
                        {
                            label: 'Skills',
                            items: [
                                'pm-skills/prioritization'
                            ],
                        },
                    ]},
            {
                label: 'Concepts',
                autogenerate: { directory: 'concepts' },
            },
            {
                label: 'About',
                autogenerate: { directory: 'about' },
            },
        ],
		}), sitemap()],
});