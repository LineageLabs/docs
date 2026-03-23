// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.way.je',
	integrations: [
		starlight({
			title: 'wayID Docs',
			head: [
				{
					tag: 'script',
					content: `if (!localStorage.getItem('starlight-theme')) { document.documentElement.dataset.theme = 'light'; }`,
				},
			],
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/LineageLabs/docs' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting Started', slug: 'guides/getting-started' },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
		}),
	],
});
