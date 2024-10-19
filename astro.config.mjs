import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Atypical Product Manager',
			pagination: false,
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
						}]
					},
					{
						label: 'Product Management Skills',
						items: [
							'pm-skills/skills'
						]},
				{
					label: 'About',
					autogenerate: { directory: 'about' },
				},
			],
		}),
	],
});
