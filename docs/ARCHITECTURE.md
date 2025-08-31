# Architecture

## Website Architecture

The website is a static site built using the JAMstack architecture.

- **Hugo**: Static site generation.
- **TailwindCSS**: Styling.
- **Alpine.js**: Interactive components.
- **Netlify**: CI/CD and deployment.

*For a detailed breakdown of the front-end architecture, see the original [design.md](design.md).*

## Automation Architecture

The project utilizes a multi-platform automation strategy to handle lead capture, client onboarding, and payment processing.

- **Tally Forms**: Lead capture and qualification.
- **Zapier**: Primary automation middleware for connecting services.
- **n8n**: Alternative/secondary automation platform.
- **Airtable**: CRM and lead management.
- **Stripe**: Payment processing and invoicing.
- **Gmail**: Email notifications and autoresponders.
