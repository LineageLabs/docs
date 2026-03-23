// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.way.je',
	integrations: [
		starlight({
			title: 'Lineage Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/LineageLabs/docs' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting Started', slug: 'guides/getting-started' },
					],
				},
			],
		}),
	],
});
