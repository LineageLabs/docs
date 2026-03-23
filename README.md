# Lineage Docs

Public documentation hub — [docs.way.je](https://docs.way.je)

Built with [Starlight](https://starlight.astro.build/). Deployed via GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow which builds and deploys to GitHub Pages automatically.

### DNS setup

Add a CNAME record pointing `docs.way.je` to `lineagelabs.github.io`.

In the repo's GitHub Settings > Pages, set the custom domain to `docs.way.je` and enable "Enforce HTTPS".
