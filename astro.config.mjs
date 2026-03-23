// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.way.je',
	integrations: [
		starlight({
			title: 'wayID Docs',
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
			},
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/LineageLabs/docs' }],
			sidebar: [
				{
					label: 'Introduction',
					items: [
						{ label: 'Overview', slug: 'introduction/overview' },
						{ label: 'FAQ', slug: 'introduction/faq' },
					],
				},
				{
					label: 'wayID Certificate',
					items: [
						{ label: 'Owner Registration', slug: 'certificate/owner-registration' },
						{ label: 'Agent Registration', slug: 'certificate/agent-registration' },
						{ label: 'OpenClaw', slug: 'certificate/openclaw' },
						{ label: 'Trust Scores', slug: 'certificate/trust-scores' },
					],
				},
				{
					label: 'Identity',
					items: [
						{ label: 'Approach', slug: 'identity/approach' },
						{ label: 'Verification Methods', slug: 'identity/methods' },
					],
				},
				{
					label: 'Agents',
					items: [
						{ label: 'Skills', slug: 'agents/skills' },
					],
				},
				{
					label: 'Integration',
					items: [
						{ label: 'Verified Agent Gateway', slug: 'integration/gateway' },
						{ label: 'SDKs', slug: 'integration/sdks' },
					],
				},
			],
			customCss: ['./src/styles/custom.css'],
		}),
	],
});
