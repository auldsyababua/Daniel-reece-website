# Epic 1: Cloudflare Migration Foundation

## Epic Goal
Establish the foundational Cloudflare infrastructure by migrating the Hugo static site from Netlify to Cloudflare Pages, configuring DNS, SSL, and security settings, while maintaining full website functionality and improving global performance through edge deployment.

## Business Value
- Unified platform management reducing operational complexity
- Improved global performance through Cloudflare's edge network
- Enhanced security with built-in DDoS protection and Web Application Firewall
- Foundation for D1 database and Workers integration in subsequent epics
- Cost reduction by consolidating services under Cloudflare

## User Stories

### Story 1.1: Cloudflare Account Setup and Domain Configuration
**As a** site administrator  
**I want** to configure executivespeechcoachingnyc.com on Cloudflare with proper DNS and security settings  
**So that** the domain is ready for Pages deployment with optimal performance and security

#### Acceptance Criteria
1. Cloudflare account configured with executivespeechcoachingnyc.com domain
2. DNS records properly migrated from current provider
3. SSL/TLS encryption set to "Full (strict)" mode  
4. Security level configured to "Medium" with DDoS protection enabled
5. Web Application Firewall (WAF) enabled with default rules
6. Page Rules configured for cache optimization
7. All existing subdomains and email routing preserved

### Story 1.2: Cloudflare Pages Project Creation
**As a** developer  
**I want** to create a Cloudflare Pages project connected to the GitHub repository  
**So that** automatic deployments are configured for the Hugo site

#### Acceptance Criteria
1. Cloudflare Pages project created and connected to GitHub repository
2. Build configuration set: `hugo --minify --baseURL $CF_PAGES_URL`
3. Build output directory configured to `public/`
4. Node.js version set to match development environment
5. Environment variables configured for Hugo build process
6. Custom domain executivespeechcoachingnyc.com connected to Pages project
7. Automatic deployments triggered on main branch commits

### Story 1.3: Hugo Build Configuration for Cloudflare
**As a** developer  
**I want** to optimize Hugo configuration for Cloudflare Pages deployment  
**So that** the site builds successfully and takes advantage of Cloudflare features

#### Acceptance Criteria  
1. `config.yaml` updated with Cloudflare-optimized settings
2. Base URL configuration supports both development and production
3. Asset minification and optimization enabled
4. Image processing configured for responsive delivery
5. Sitemap and robots.txt generation enabled
6. Build time under 60 seconds on Cloudflare infrastructure
7. All existing Hugo features (dark mode, Alpine.js) work correctly

#### Implementation Details
**Cloudflare Pages Build Configuration:**
- **Build command**: `hugo --minify --baseURL $CF_PAGES_URL`
- **Build output directory**: `public`
- **Root directory**: `/` (project root)
- **Environment variables**:
  ```bash
  HUGO_VERSION=0.120.4
  NODE_VERSION=18
  ```

**Hugo Config Optimization (config.yaml):**
```yaml
baseURL: "https://executivespeechcoachingnyc.com"
languageCode: "en-us"
title: "Dan Reece - Executive Speech Coach"

build:
  writeStats: true

minify:
  disableCSS: false
  disableHTML: false
  disableJS: false
  disableJSON: false
  disableSVG: false
  disableXML: false

params:
  env: "production"
```

**Asset Processing Pipeline:**
- **CSS**: TailwindCSS → PostCSS → Minification
- **JS**: Alpine.js bundling → Minification  
- **Images**: WebP conversion → Responsive sizes
- **Fonts**: Preloading optimization

### Story 1.4: DNS and Subdomain Preparation
**As a** site administrator  
**I want** to prepare DNS configuration for the admin subdomain  
**So that** admin.executivespeechcoachingnyc.com is ready for D1 Manager deployment

#### Acceptance Criteria
1. CNAME record created for admin.executivespeechcoachingnyc.com pointing to Cloudflare Pages
2. SSL certificate provisioned for admin subdomain
3. Security policies applied to admin subdomain
4. Access rules configured to restrict admin access if needed
5. DNS propagation verified globally
6. Both www and apex domain redirects working correctly
7. Email routing preserved for existing business email addresses

### Story 1.5: Performance and Security Validation
**As a** website visitor  
**I want** the site to load faster and be more secure than the Netlify version  
**So that** I have an optimal browsing experience

#### Acceptance Criteria
1. Page load times improved by at least 20% compared to Netlify
2. Lighthouse performance score maintains 90+ rating
3. Core Web Vitals meet Google's thresholds
4. HTTPS enforced with HSTS headers  
5. Security headers configured (CSP, X-Frame-Options, etc.)
6. DDoS protection verified through testing
7. Global CDN performance tested from multiple regions

### Story 1.6: Content and Asset Migration Verification
**As a** content manager  
**I want** all website content and assets to display correctly  
**So that** no functionality is lost during migration

#### Acceptance Criteria
1. All pages render correctly with proper styling
2. Partner logos display with proper dark/light mode switching
3. Contact forms remain functional (will be enhanced in Epic 3)
4. Hero video embeds work correctly
5. All images load with proper optimization
6. Navigation and footer links function properly
7. Blog posts and services pages display correctly

## Technical Requirements

### Infrastructure Setup
- Cloudflare account with Pro plan for advanced features
- GitHub integration for automatic deployments
- Custom domain configuration with SSL
- DNS management transferred to Cloudflare

### Build Configuration
- Hugo static site generator with Cloudflare optimizations
- TailwindCSS compilation in build pipeline
- Alpine.js bundling and minification
- Image optimization and WebP conversion
- Asset minification and compression

### Security Configuration
- SSL/TLS Full (strict) mode
- Web Application Firewall with OWASP rules
- DDoS protection at L3/L4 and L7
- Security headers (HSTS, CSP, X-Frame-Options)
- Rate limiting for form endpoints

### Performance Optimization  
- Global CDN with edge caching
- Brotli compression enabled
- Cache-Control headers optimized
- Critical CSS inlining
- Image lazy loading preparation

## Dependencies
- GitHub repository access for deployment configuration
- Domain registrar access for DNS delegation to Cloudflare
- Current Netlify configuration for reference
- SSL certificate management permissions

## Risks and Mitigations
- **DNS propagation delays**: Plan migration during low-traffic period
- **Build pipeline differences**: Test thoroughly in Cloudflare environment
- **Email delivery impact**: Verify email routing before cutting over
- **Performance regression**: Monitor metrics closely during migration

## Definition of Done
- Site successfully deployed on Cloudflare Pages
- DNS fully migrated with no broken links or assets
- Performance improved or maintained compared to Netlify
- All security features enabled and tested
- Admin subdomain ready for Epic 2 D1 Manager deployment
- Documentation updated with new deployment process