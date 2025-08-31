# Automation

This document consolidates all automation-related information for the Dan Reece Executive Speech Coaching website.

## Overview

The automation system is designed to streamline the client lifecycle, from initial contact to alumni engagement. It uses a combination of Tally, Zapier, n8n, Airtable, Stripe, and Gmail to create a seamless and professional experience.

## Lead Capture and Management

- **Forms**: Tally is used for professional form capture with built-in lead qualification questions.
- **Webhook**: Tally forms trigger a Zapier webhook on submission.
- **Lead Scoring**: A Python script in Zapier calculates a lead score based on the form submission.
- **CRM**: The lead is then created or updated in an Airtable base, which serves as the CRM.

## Automation Platforms

### Zapier (Primary)

Zapier is the primary automation platform. It handles:

- Catching webhooks from Tally forms.
- Running the lead scoring algorithm.
- Creating and updating records in Airtable.
- Sending email notifications via Gmail.
- Integrating with Stripe for payment processing.

### n8n (Secondary/Alternative)

n8n is used as a secondary or alternative automation platform. It has been configured to handle:

- Contact form automation.
- Stripe invoice automation.

Due to some webhook routing issues with the n8n cloud instance, Zapier is currently the more reliable primary solution.

## Services

### Airtable

Airtable is used as the CRM. The base is named "Executive Speech Coaching Leads" and contains tables for:

- Leads
- Email History
- Meetings
- Proposals
- Newsletter Subscribers

### Stripe

Stripe is used for payment processing and invoicing. It is integrated with the automation platforms to:

- Trigger workflows on new payments.
- Update client status in Airtable.
- Send automated welcome emails.

*For detailed setup guides, please refer to the individual files in the `automation` directory.*
