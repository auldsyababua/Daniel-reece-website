# Dan Reece Executive Speech Coaching - Coding Standards

## Hugo Development Patterns and Conventions

### Template Development Standards

#### Template Organization
- **Base Template**: Use `baseof.html` for all common HTML structure
- **Single Responsibility**: Each template should have one clear purpose
- **Partial Templates**: Extract reusable components into `/layouts/partials/`
- **Template Inheritance**: Always extend `baseof.html` with `{{ define "main" }}`

#### Template Naming Conventions
```
# Layout Templates
layouts/_default/baseof.html     # Base template
layouts/_default/single.html     # Individual page template  
layouts/_default/list.html       # List page template
layouts/index.html               # Homepage template

# Partial Templates  
layouts/partials/head.html       # HTML head section
layouts/partials/nav.html        # Navigation component
layouts/partials/footer.html     # Footer component
layouts/partials/components/     # Reusable components
```

#### Performance-Critical Template Rules
- **Use `partialCached` for expensive partials**: Always cache partials that don't change per page
```html
{{ partialCached "components/sidebar.html" . }}
```
- **Avoid complex logic in templates**: Move complex operations to data processing or shortcodes
- **Minimize `range` loops**: Pre-process large data sets in data files
- **Use template metrics**: Run `hugo --templateMetrics --templateMetricsHints` during development

### Content Management Standards

#### Front Matter Structure
```yaml
# Required for all content
title: "Page Title"
description: "SEO description under 160 characters"
date: "2025-01-08T10:00:00-05:00"
draft: false

# Optional but recommended
featured_image: "/images/featured/page-name.webp"
keywords: ["keyword1", "keyword2", "keyword3"]
weight: 10  # For ordering in lists

# Service-specific front matter
service_image: "/images/services/service-name.webp"
buttons:
  - text: "Virtual Session"
    url: "https://calendly.com/danreece/virtual"
  - text: "In-Person Session"  
    url: "https://calendly.com/danreece/in-person"
skills:
  - "Public Speaking"
  - "Executive Presence"
  - "Communication Skills"
```

#### Content File Organization
- **Use descriptive filenames**: `executive-presentation-skills.md` not `page1.md`
- **Organize by content type**: `/posts/`, `/services/`, `/pages/`
- **Include `_index.md` for sections**: Provides section metadata and listing pages
- **Use consistent date formats**: ISO 8601 format with timezone

### Asset Management Standards

#### Image Optimization Rules
- **Use Hugo image processing**: Always process images through Hugo pipeline
- **WebP format**: Convert all images to WebP for performance
- **Responsive images**: Generate multiple sizes for different breakpoints
- **Lazy loading**: Implement lazy loading for below-fold images

#### Image Processing Examples
```html
<!-- Hugo Image Processing -->
{{ with resources.Get "images/hero.jpg" }}
  {{ $webp := .Resize "1200x webp q85" }}
  {{ $mobile := .Resize "600x webp q85" }}
  <picture>
    <source media="(max-width: 767px)" srcset="{{ $mobile.RelPermalink }}">
    <img src="{{ $webp.RelPermalink }}" 
         alt="Hero image" 
         loading="lazy"
         width="{{ $webp.Width }}" 
         height="{{ $webp.Height }}">
  </picture>
{{ end }}
```

#### CSS Asset Standards
- **Use TailwindCSS utilities**: Prefer utility classes over custom CSS
- **Component-based CSS**: Group related utilities with `@apply` in rare custom CSS
- **Purge unused styles**: Ensure TailwindCSS purging is configured correctly
- **Dark mode support**: Use Tailwind's dark mode with class strategy

### TailwindCSS Organization Standards

#### Utility Class Conventions
```html
<!-- Responsive Design Pattern -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
<!-- Component Sizing Pattern -->
<button class="px-6 py-3 text-lg font-semibold rounded-lg">

<!-- Dark Mode Pattern -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

#### Custom CSS Guidelines (Minimal Use)
```css
/* assets/css/main.css */
@import "tailwindcss";

/* Only add custom CSS for complex components */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors;
  }
}

/* Source Hugo stats for Tailwind purging */
@source "hugo_stats.json";
```

### Alpine.js Component Patterns

#### Component Structure Standards
```html
<!-- Single Responsibility Components -->
<div x-data="{ darkMode: $persist(false) }" 
     x-init="$store.darkMode.init()">
  
<!-- Event Handling Pattern -->  
<button @click="toggleMobileMenu()" 
        :aria-expanded="mobileMenuOpen"
        :class="{ 'menu-open': mobileMenuOpen }">

<!-- State Management Pattern -->
<div x-show="isVisible" 
     x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0 scale-90"
     x-transition:enter-end="opacity-100 scale-100">
```

#### Alpine.js Best Practices
- **Use `x-init` for initialization**: Set up component state and event listeners
- **Prefer `x-show` over `x-if`**: Better performance for frequently toggled elements
- **Use `$persist` for localStorage**: Dark mode, user preferences
- **Scope data appropriately**: Keep component data isolated with `x-data`

### Cloudflare Workers Development Guidelines

#### Worker Structure Standards
```javascript
// workers/contact-form.js
export default {
  async fetch(request, env, ctx) {
    // CORS handling for all requests
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }
    
    try {
      // Route-based handling
      const url = new URL(request.url);
      
      switch (url.pathname) {
        case '/api/contact':
          return await handleContactForm(request, env);
        case '/api/health':
          return new Response('OK', { status: 200 });
        default:
          return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      // Centralized error handling
      return handleError(error);
    }
  }
};
```

#### Database Interaction Patterns
```javascript
// D1 Database Operations
async function createLead(db, leadData) {
  const stmt = db.prepare(`
    INSERT INTO leads (name, email, message, created_at, source)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  return await stmt.bind(
    leadData.name,
    leadData.email, 
    leadData.message,
    new Date().toISOString(),
    'contact_form'
  ).run();
}

// Error handling for database operations
async function safeDbOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new Error('Database operation failed');
  }
}
```

#### Security Standards for Workers
```javascript
// Input validation
function validateContactForm(data) {
  const schema = {
    name: { required: true, maxLength: 100 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    message: { required: true, maxLength: 2000 }
  };
  
  return validateSchema(data, schema);
}

// Rate limiting
async function checkRateLimit(request, env) {
  const clientIP = request.headers.get('CF-Connecting-IP');
  const key = `rate_limit:${clientIP}`;
  
  const current = await env.KV.get(key);
  if (current && parseInt(current) > RATE_LIMIT) {
    throw new Error('Rate limit exceeded');
  }
  
  await env.KV.put(key, String((parseInt(current) || 0) + 1), { expirationTtl: 3600 });
}
```

### JavaScript Development Standards

#### File Organization
```
assets/js/
├── components/          # Component-specific JavaScript
│   ├── darkmode.js     # Dark mode functionality
│   ├── contact-form.js # Form handling and validation
│   └── navigation.js   # Navigation interactions
├── utils/              # Utility functions
│   ├── api.js         # API communication helpers
│   ├── validation.js  # Input validation utilities
│   └── storage.js     # LocalStorage helpers
└── main.js            # Entry point and initialization
```

#### Code Quality Standards
```javascript
// Use modern ES6+ features
const API_BASE = '/api/v1';

// Async/await pattern
async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Form submission failed:', error);
    throw error;
  }
}

// Error boundaries for user-facing errors
function handleFormError(error) {
  const message = error.message || 'An unexpected error occurred';
  showUserNotification(message, 'error');
}
```

### Git Commit Message Standards

#### Commit Message Format
```
type(scope): subject line under 50 characters

Optional body explaining what and why vs. how.
Can be multiple paragraphs.

- Bullet points are okay too
- Use imperative mood: "fix" not "fixed" or "fixes"
- Reference issues: "Closes #123"
```

#### Commit Types
- **feat**: New feature for the user
- **fix**: Bug fix for the user  
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding missing tests
- **chore**: Build process or auxiliary tool changes

#### Examples
```
feat(contact): add form validation with real-time feedback

fix(darkmode): resolve toggle state persistence issue

docs(architecture): update Cloudflare Workers documentation

perf(images): implement WebP conversion and lazy loading

chore(deps): update TailwindCSS to v4.0.1
```

### Code Review Criteria

#### Hugo Templates
- [ ] Templates use `partialCached` where appropriate
- [ ] No complex logic in templates (use data processing)
- [ ] SEO meta tags are properly implemented
- [ ] Accessibility attributes are present (alt, aria-*)
- [ ] Responsive design is implemented

#### CSS/Styling  
- [ ] TailwindCSS utilities used instead of custom CSS
- [ ] Dark mode support is implemented consistently
- [ ] Mobile-first responsive design approach
- [ ] Performance budget maintained (< 50KB CSS)

#### JavaScript
- [ ] Modern ES6+ syntax used consistently
- [ ] Error handling is implemented properly
- [ ] API calls include proper error boundaries
- [ ] LocalStorage usage follows privacy guidelines

#### Cloudflare Workers
- [ ] Input validation on all endpoints
- [ ] CORS headers configured correctly  
- [ ] Rate limiting implemented
- [ ] Database operations use prepared statements
- [ ] Error responses don't leak sensitive information

### Performance Standards

#### Build Performance
- **Build time target**: < 5 seconds for full rebuild
- **Template metrics**: No single template > 100ms average duration
- **Asset pipeline**: Images processed in parallel where possible
- **Cache utilization**: Partial templates cached when possible

#### Runtime Performance  
- **Page load time**: < 1.5s First Contentful Paint
- **Time to Interactive**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **JavaScript bundle**: < 50KB gzipped

#### Database Performance
- **Query response time**: < 100ms for simple queries
- **Connection pooling**: Use D1's built-in connection management
- **Query optimization**: Use indexes for frequently queried fields
- **Batch operations**: Group multiple operations where possible

### Security Requirements

#### Content Security Policy
```javascript
// Cloudflare Workers CSP headers
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'"
].join('; ');

response.headers.set('Content-Security-Policy', cspHeader);
```

#### Input Sanitization
- **Always validate input**: Both client-side and server-side
- **Escape HTML output**: Use Hugo's built-in escaping
- **Parameterized queries**: Never concatenate user input into SQL
- **Rate limiting**: Implement per-IP rate limiting on forms

#### Authentication & Authorization  
- **Admin interface**: Secure D1 Manager with Cloudflare Access
- **API endpoints**: Implement proper authentication for sensitive operations
- **CORS policy**: Restrictive CORS configuration
- **Environment variables**: Never commit secrets to repository

### Environment Management

#### Development Environment
```bash
# Local development setup
npm install
hugo server --buildDrafts --buildFuture

# Watch TailwindCSS changes
npm run css:watch

# Template performance monitoring
hugo --templateMetrics --templateMetricsHints
```

#### Production Environment
```bash
# Production build
hugo --minify --gc --environment production

# Environment variables required
HUGO_VERSION=0.128.0
HUGO_ENV=production
CF_PAGES_URL=$DEPLOY_PRIME_URL
```

#### Testing Standards
- **Cross-browser testing**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile testing**: iOS Safari, Chrome Mobile, Samsung Internet
- **Performance testing**: Lighthouse CI in deployment pipeline
- **Accessibility testing**: axe-core automation + manual testing

These coding standards ensure consistent, performant, and secure development practices across the entire Cloudflare-first architecture for the Dan Reece Executive Speech Coaching website.