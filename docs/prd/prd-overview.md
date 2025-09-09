# Dan Reece Executive Speech Coaching - Cloudflare-First PRD Overview

## Goals and Background Context

### Goals
- Migrate from Netlify/Airtable to a unified Cloudflare ecosystem for better performance and cost efficiency
- Deploy D1 Manager on admin.executivespeechcoachingnyc.com subdomain to provide Dan with a spreadsheet-like interface for client management
- Establish Cloudflare D1 as the primary database, replacing Airtable dependency
- Create seamless form-to-database workflows using Cloudflare Workers and Pages Functions
- Implement n8n cloud integration for complex automation (Stripe payments, email sequences)
- Achieve unified platform management with all services on Cloudflare infrastructure

### Background Context

Dan Reece currently operates a successful executive speech coaching business serving C-suite executives from major corporations (AstraZeneca, BlackRock, Google, Netflix). The current infrastructure uses Netlify for hosting and Airtable for comprehensive business management with 11 interconnected tables managing clients, sessions, progress reports, invoices, and automation workflows.

The migration to Cloudflare-first architecture will provide unified platform benefits, reduced costs, better performance with edge deployment, and simplified management. The D1 Manager deployment will give Dan immediate value by providing a familiar spreadsheet-like interface for client management while establishing the foundation for future custom features.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-01-08 | 1.0 | Initial Cloudflare-first PRD with D1 Manager | John (PM Agent) |

## Current Airtable Database Structure Analysis

Based on the existing Airtable base "ExecutiveSpeechCoachingNYC.com Client Management" (appXk9QepZD7Riwyl), the following tables need migration:

### Core Business Tables (11 total):

1. **Clients** - Central client management with contact details, preferences, photos
2. **Sessions** - Session scheduling, topics, resources, photos
3. **Progress Reports** - Client progress tracking with ratings and coach feedback  
4. **Feedback** - Client satisfaction ratings and improvement suggestions
5. **Invoices** - Financial management with payment status tracking
6. **Sales** - Sales pipeline with packages and payment methods
7. **Referrals** - Referral tracking and conversion management
8. **Automation Rules** - Business process automation triggers and actions
9. **Goals** - Client goal setting with progress tracking
10. **Automation Log** - Comprehensive logging of all automated activities
11. **Form Submissions** - New table needed for website form data

### Key Database Relationships:
- Clients → Sessions (1:many)
- Clients → Progress Reports (1:many) 
- Sessions → Progress Reports (1:1)
- Clients → Invoices (1:many)
- Clients → Sales (1:many)
- Clients → Goals (1:many)
- All tables → Automation Log (many:many)

## Success Metrics

### Technical Success Criteria
- **Performance**: Page load times under 2 seconds globally via Cloudflare edge
- **Uptime**: 99.9% availability using Cloudflare infrastructure
- **Cost**: 50%+ reduction in monthly hosting and database costs
- **D1 Manager**: Fully functional admin interface accessible at admin.executivespeechcoachingnyc.com

### Business Success Criteria  
- **Seamless Migration**: Zero data loss from Airtable → D1 migration
- **Admin Efficiency**: Dan can manage all client data through D1 Manager interface
- **Form Integration**: Contact forms populate D1 database automatically
- **Automation Continuity**: n8n workflows continue processing Stripe/email automation

### User Experience Success Criteria
- **Form Submission**: Contact forms work seamlessly with 100% success rate
- **Admin Access**: D1 Manager provides spreadsheet-like editing capabilities  
- **Performance**: Website loads faster than current Netlify deployment
- **Mobile Optimization**: All admin functions work on mobile devices

## Technology Stack: Cloudflare-First Architecture

### Core Infrastructure
- **Main Site**: Cloudflare Pages (executivespeechcoachingnyc.com) 
  - Hugo Static Site Generator + Tailwind CSS + Alpine.js
  - Cloudflare edge deployment for global performance
- **Database Admin**: Cloudflare Pages (admin.executivespeechcoachingnyc.com)
  - D1 Manager deployment for client data management
- **Database**: Cloudflare D1 (replacing Airtable)
  - 11 tables migrated from existing Airtable structure
  - Relationships maintained through foreign keys
- **Forms**: Cloudflare Workers + Pages Functions
  - Contact form processing → D1 database insertion
  - Real-time validation and confirmation workflows

### External Integrations
- **Complex Automation**: n8n cloud for Stripe payments and email sequences
- **CDN/Security**: Cloudflare DNS, SSL, DDoS protection, Web Application Firewall  
- **Storage**: Cloudflare R2 for asset storage if needed
- **Monitoring**: Cloudflare Analytics and Web Analytics

### Migration Benefits
1. **Unified Platform**: All services on Cloudflare reduce complexity
2. **Edge Performance**: Global deployment with sub-second response times
3. **Cost Efficiency**: Significant reduction in monthly operational costs
4. **Simplified Management**: Single dashboard for all infrastructure
5. **Enhanced Security**: Built-in WAF, DDoS protection, SSL management
6. **Scalability**: Serverless architecture scales automatically

## Next Steps

This PRD will be broken down into 5 sequential epics:

1. **Epic 1**: Cloudflare Migration Foundation
2. **Epic 2**: D1 Database Setup & Migration  
3. **Epic 3**: Forms Automation & Integration
4. **Epic 4**: D1 Manager Admin Interface
5. **Epic 5**: Performance Optimization & Launch

Each epic is designed to deliver incremental value while building toward the complete Cloudflare-first architecture.