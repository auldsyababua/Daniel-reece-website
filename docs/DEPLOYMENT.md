# Deployment

## Netlify

The website is deployed on Netlify. The deployment is configured in the `netlify.toml` file.

- **Build Command**: `npm run build`
- **Publish Directory**: `public`

Any push to the `main` branch will trigger a production deployment. Pull requests will generate a deploy preview.

## Cloudflare Pages

The project can also be deployed to Cloudflare Pages.

- **Preset**: `Hugo`
- **Build Command**: `npm install && hugo --gc --minify`

### Environment Variables for Cloudflare Pages v1

- `HUGO_VERSION=0.111.3`
- `GO_VERSION=1.20.3`
- `NODE_VERSION=18.16.0`
