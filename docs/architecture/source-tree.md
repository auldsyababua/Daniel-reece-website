# Dan Reece Executive Speech Coaching - Repository Structure

## Directory Organization and Purpose

### Root Configuration Files

```
├── .env                    # Environment variables (local development)
├── .gitignore             # Git ignore patterns
├── .hugo_build.lock       # Hugo build lock file (auto-generated)
├── hugo.yaml.exampleSite  # Example Hugo configuration
├── netlify.toml          # Netlify deployment configuration (legacy)
├── package.json          # NPM dependencies and scripts
├── pnpm-lock.yaml        # PNPM lock file for reproducible builds
├── postcss.config.js     # PostCSS configuration for TailwindCSS
├── tailwind.config.js    # TailwindCSS configuration
├── theme.toml            # Hugo theme metadata
└── LICENSE               # Project license
```

### BMAD Framework Structure

```
├── .bmad-core/                    # BMAD Method core framework
│   ├── agents/                    # AI agent definitions
│   │   ├── architect.md           # System architecture agent
│   │   ├── dev.md                # Development agent
│   │   ├── pm.md                 # Project manager agent
│   │   └── [other agents]        # Additional specialized agents
│   ├── checklists/               # Quality assurance checklists
│   ├── core-config.yaml          # BMAD core configuration
│   ├── data/                     # Reference data and knowledge base
│   ├── tasks/                    # Reusable task definitions
│   ├── templates/                # Document templates (YAML-based)
│   ├── utils/                    # Utility functions and helpers
│   └── workflows/                # Workflow definitions
├── .bmad-infrastructure-devops/   # Infrastructure/DevOps extension
└── .claude/                      # Claude AI command definitions
    └── commands/
        ├── BMad/                 # BMAD method commands
        └── bmadInfraDevOps/      # Infrastructure commands
```

### Content Management System

```
├── content/                      # Hugo content directory
│   ├── _index.md                # Homepage content
│   ├── about.md                 # About page content
│   ├── contact.md               # Contact page content
│   ├── contact/
│   │   └── thank-you.md         # Contact form success page
│   ├── posts/                   # Blog posts directory
│   │   ├── _index.md            # Blog listing page
│   │   ├── audience-opportunity-not-obstacle.md
│   │   └── audition-mindset-boardroom.md
│   └── services/                # Service pages directory
│       ├── _index.md            # Services listing page
│       ├── 1-1-speech-coaching.md
│       ├── discovery-call.md
│       ├── executive-training-programs.md
│       └── group-communication-training.md
├── archetypes/                   # Content templates for new pages
│   └── default.md               # Default page template
└── i18n/                        # Internationalization files
    └── en.toml                  # English language strings
```

### Layout and Template System

```
├── layouts/                     # Hugo template files
│   ├── _default/               # Default templates
│   │   ├── baseof.html         # Base template with common structure
│   │   ├── list.html           # List page template
│   │   ├── single.html         # Single page template
│   │   ├── about.html          # About page template
│   │   └── contact.html        # Contact page template
│   ├── index.html              # Homepage template
│   ├── 404.html               # Error page template
│   ├── partials/               # Reusable template components
│   │   ├── components/         # Component partials
│   │   ├── head.html           # HTML head section
│   │   ├── meta.html           # Meta tags and SEO
│   │   ├── nav.html            # Navigation component
│   │   ├── footer.html         # Footer component
│   │   ├── contact-form.html   # Contact form component
│   │   ├── pagination.html     # Pagination controls
│   │   ├── posts-template.html # Blog post template
│   │   ├── schema-article.html # JSON-LD article schema
│   │   └── schema-business.html # JSON-LD business schema
│   ├── posts/                  # Blog-specific templates
│   │   ├── list.html           # Blog listing template
│   │   └── single.html         # Individual blog post template
│   ├── services/               # Service-specific templates
│   │   ├── list.html           # Services listing template
│   │   └── single.html         # Individual service template
│   └── shortcodes/             # Hugo shortcodes
│       └── imgc.html           # Image optimization shortcode
```

### Asset Management

```
├── assets/                      # Source assets (processed by Hugo)
│   ├── css/
│   │   ├── main.css            # Main CSS entry point
│   │   └── style.css           # Legacy styles
│   ├── images/                 # Source images for processing
│   │   ├── featured/           # Featured images
│   │   ├── global/             # Global/shared images
│   │   ├── logo/               # Logo variations
│   │   ├── pages/              # Page-specific images
│   │   ├── partners/           # Partner company logos
│   │   ├── photo/              # Photography assets
│   │   └── posts/              # Blog post images
│   ├── js/
│   │   ├── contact-form.js     # Contact form functionality
│   │   └── darkmode.js         # Dark mode toggle
│   └── jsconfig.json           # JavaScript configuration
├── static/                     # Static assets (served as-is)
│   ├── favicon/                # Favicon files
│   ├── images/                 # Optimized static images
│   ├── js/                     # Static JavaScript files
│   └── robots.txt              # Search engine directives
└── public/                     # Generated output (Hugo build)
    ├── [mirrors static structure] # Generated HTML, CSS, JS
    └── [optimized assets]      # Processed and optimized assets
```

### Documentation Structure

```
├── docs/                       # Project documentation
│   ├── architecture/           # Architecture documentation
│   │   ├── architecture-overview.md  # System architecture overview
│   │   ├── tech-stack.md            # Technology stack details
│   │   ├── source-tree.md           # Repository structure (this file)
│   │   └── coding-standards.md      # Development standards
│   ├── prd/                   # Product Requirements Documents
│   │   ├── prd-overview.md    # PRD overview and index
│   │   ├── epic-001-cloudflare-migration.md
│   │   ├── epic-002-d1-database-setup.md
│   │   ├── epic-003-forms-automation.md
│   │   ├── epic-004-admin-interface.md
│   │   └── epic-005-performance-optimization.md
│   ├── stories/               # User stories (future)
│   ├── qa/                    # Quality assurance documentation
│   ├── requirements.md        # Business requirements
│   ├── design.md             # Technical design document
│   ├── tasks.md              # Implementation tasks
│   ├── ARCHITECTURE.md       # Legacy architecture notes
│   ├── AUTOMATION.md         # Automation documentation
│   ├── DEPLOYMENT.md         # Deployment procedures
│   ├── DEVELOPMENT.md        # Development guidelines
│   └── README.md             # Project overview
```

### Development and Automation

```
├── automation/                 # Business automation configuration
│   ├── config.yaml            # Automation configuration
│   ├── n8n-config.json        # n8n workflow configuration
│   ├── package.json           # Automation dependencies
│   └── [workflow files]       # n8n workflow definitions
├── scripts/                   # Development and deployment scripts
│   ├── check-spec-sync.sh     # Specification sync checker
│   ├── task-report.sh         # Task reporting utility
│   └── update-task.sh         # Task update utility
├── tests/                     # Testing infrastructure
│   ├── scripts/               # Test automation scripts
│   └── webhooks/              # Webhook testing utilities
└── resources/                 # Hugo generated resources
    └── _gen/                  # Generated assets cache
        ├── assets/            # Generated CSS, JS bundles
        └── images/            # Processed and optimized images
```

### Archive and Legacy

```
└── archive/                   # Archived and legacy files
    ├── automation-legacy/     # Legacy automation configurations
    ├── kiro/                  # Legacy Kiro framework files
    └── webhooks/              # Legacy webhook implementations
```

## File Naming Conventions

### Content Files
- **Pages**: `kebab-case.md` (e.g., `about-us.md`)
- **Blog Posts**: `descriptive-title.md` (e.g., `audience-opportunity-not-obstacle.md`)
- **Services**: `service-name.md` (e.g., `1-1-speech-coaching.md`)

### Template Files
- **Layout Templates**: `kebab-case.html` (e.g., `baseof.html`, `single.html`)
- **Partial Templates**: `kebab-case.html` (e.g., `contact-form.html`)
- **Component Templates**: `component-name.html` (stored in `partials/components/`)

### Asset Organization

#### Images
- **Global Assets**: `/static/images/` for static images
- **Processed Assets**: `/assets/images/` for Hugo-processed images
- **Organization by Type**:
  - `/images/logo/` - Logo variations and brand assets
  - `/images/partners/` - Partner company logos
  - `/images/services/` - Service-specific images
  - `/images/posts/` - Blog post featured images
  - `/images/photo/` - Photography and headshots

#### CSS Organization
- **Main Entry**: `/assets/css/main.css` (TailwindCSS compilation)
- **Legacy Styles**: `/assets/css/style.css` (gradual migration)
- **Generated Output**: `/public/css/style.[hash].css` (Hugo processing)

#### JavaScript Organization
- **Component Scripts**: `/assets/js/component-name.js`
- **Utility Scripts**: `/assets/js/utility-name.js`
- **Generated Bundles**: `/public/js/bundle.min.[hash].js`

## Development Workflow Structure

### Local Development
1. **Source Files**: Edit in `/content/`, `/layouts/`, `/assets/`
2. **Live Reload**: Hugo server watches for changes
3. **Asset Pipeline**: TailwindCSS compiles on change
4. **Generated Output**: Available in `/public/` (gitignored)

### Build Process
1. **Content Processing**: Hugo renders Markdown to HTML
2. **Asset Optimization**: Images processed, CSS compiled
3. **Bundle Generation**: JavaScript bundled and minified
4. **Output Generation**: Complete site in `/public/`

### Deployment Structure
1. **Source Repository**: Git repository with all source files
2. **Build Command**: `hugo -b $CF_PAGES_URL` (Cloudflare Pages)
3. **Output Directory**: `/public/` deployed to CDN
4. **Cache Management**: Hugo resources cached for performance

## Configuration File Purposes

### Hugo Configuration
- **Primary Config**: `hugo.yaml` (YAML format)
- **Build Settings**: Asset processing, imaging, minification
- **Content Settings**: Taxonomies, permalinks, menu structure
- **Development Settings**: Live reload, draft content handling

### Build Tool Configuration
- **TailwindCSS**: `tailwind.config.js` - utility classes, custom theme
- **PostCSS**: `postcss.config.js` - CSS processing pipeline
- **NPM**: `package.json` - dependencies and build scripts

### Framework Configuration
- **BMAD Core**: `.bmad-core/core-config.yaml` - project structure settings
- **Environment**: `.mcp/.env` - MCP (Model Context Protocol) settings
- **Git**: `.gitignore` - version control exclusions

This repository structure supports the Cloudflare-first architecture while maintaining Hugo's conventions and the BMAD Method's organizational patterns. The clear separation between source assets, generated content, and configuration enables efficient development and deployment workflows.