# User Story 001-4: DNS and Subdomain Preparation

## User Story
**As a** site administrator  
**I want** to prepare DNS configuration for the admin subdomain  
**So that** admin.executivespeechcoachingnyc.com is ready for D1 Manager deployment

## Acceptance Criteria
1. ✅ CNAME record created for admin.executivespeechcoachingnyc.com pointing to Cloudflare Pages
2. ✅ SSL certificate provisioned for admin subdomain
3. ✅ Security policies applied to admin subdomain
4. ✅ Access rules configured to restrict admin access if needed
5. ✅ DNS propagation verified globally
6. ✅ Both www and apex domain redirects working correctly
7. ✅ Email routing preserved for existing business email addresses

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Cloudflare DNS Management**: Primary configuration interface
- **mcp__github__**: Documentation and configuration tracking
- **DNS Propagation Tools**: Global verification
- **SSL Labs**: Certificate validation

### 📋 Step-by-Step Implementation

#### 1. DNS Record Configuration
**Primary DNS Records Setup:**
```dns
# Core domain records
A     executivespeechcoachingnyc.com                → 192.0.2.1 (Cloudflare Proxy)
CNAME www.executivespeechcoachingnyc.com           → executivespeechcoachingnyc.com
CNAME admin.executivespeechcoachingnyc.com         → dan-reece-executive-coaching.pages.dev

# Email preservation
MX    executivespeechcoachingnyc.com               → [Existing Mail Server] (Priority 10)
TXT   executivespeechcoachingnyc.com               → "v=spf1 include:[provider] ~all"
TXT   _dmarc.executivespeechcoachingnyc.com        → "v=DMARC1; p=quarantine; rua=mailto:dmarc@executivespeechcoachingnyc.com"
CNAME mail.executivespeechcoachingnyc.com          → [Existing Mail Server]

# Additional subdomains for future use
CNAME api.executivespeechcoachingnyc.com           → executivespeechcoachingnyc.com (Reserved for Epic 003)
CNAME cdn.executivespeechcoachingnyc.com           → executivespeechcoachingnyc.com (Reserved for assets)
```

#### 2. Cloudflare Page Rules for Subdomains
**Admin Subdomain Security Rules:**
```yaml
Rule 1: admin.executivespeechcoachingnyc.com/*
  Settings:
    Security Level: High
    Cache Level: Bypass
    Browser Integrity Check: ON
    Email Obfuscation: ON
    Server Side Excludes: ON
    
Rule 2: admin.executivespeechcoachingnyc.com/login*
  Settings:
    Security Level: I'm Under Attack
    Challenge Passage: 30 minutes
    Browser Integrity Check: ON
```

**Main Domain Optimization:**
```yaml  
Rule 3: executivespeechcoachingnyc.com/assets/*
  Settings:
    Cache Level: Cache Everything
    Edge Cache TTL: 1 month
    Browser Cache TTL: 1 month

Rule 4: www.executivespeechcoachingnyc.com/*  
  Settings:
    Forwarding URL: 301 - https://executivespeechcoachingnyc.com/$1
    
Rule 5: executivespeechcoachingnyc.com/*
  Settings:
    Cache Level: Standard
    Browser Cache TTL: 4 hours
    Always Online: ON
```

#### 3. SSL Certificate Management
**SSL/TLS Configuration:**
```yaml
Certificate Settings:
  Type: Universal SSL Certificate
  Coverage: 
    - executivespeechcoachingnyc.com
    - *.executivespeechcoachingnyc.com
    - admin.executivespeechcoachingnyc.com
  Validation: HTTP
  Encryption Mode: Full (strict)

Advanced Settings:
  TLS 1.3: Enabled
  HSTS: Enabled
  - Max Age: 12 months
  - Include Subdomains: Yes
  - Preload: Yes
  Always Use HTTPS: ON
  Automatic HTTPS Rewrites: ON
```

#### 4. Access Control Configuration
**Firewall Rules for Admin Subdomain:**
```javascript
// Cloudflare Firewall Expression
(http.host eq "admin.executivespeechcoachingnyc.com" and 
 not ip.src in {192.168.1.0/24 10.0.0.0/8 172.16.0.0/12} and
 not cf.client.bot)

// Action: JavaScript Challenge
// Note: Adjust IP ranges based on admin team locations
```

**Rate Limiting for Admin:**
```yaml
Rate Limit Rules:
  admin.executivespeechcoachingnyc.com/login:
    Threshold: 5 requests per minute
    Period: 60 seconds
    Action: Challenge (Captcha)
    
  admin.executivespeechcoachingnyc.com/api/*:
    Threshold: 100 requests per minute  
    Period: 60 seconds
    Action: Block
```

#### 5. Email Routing Preservation
**Email Routing Configuration:**
```yaml
Email Routing Settings:
  Status: Enabled
  Catch-all: Disabled
  
Custom Addresses:
  dan@executivespeechcoachingnyc.com → [Primary Email]
  info@executivespeechcoachingnyc.com → [Business Email]  
  admin@executivespeechcoachingnyc.com → [Admin Email]
  support@executivespeechcoachingnyc.com → [Support Email]
  
MX Records:
  Priority 10: mail.executivespeechcoachingnyc.com
  Priority 20: backup-mail.executivespeechcoachingnyc.com
```

### 🎯 DNS Propagation Testing
```bash
# Global DNS propagation check
dig @1.1.1.1 admin.executivespeechcoachingnyc.com CNAME
dig @8.8.8.8 admin.executivespeechcoachingnyc.com CNAME  
dig @208.67.222.222 admin.executivespeechcoachingnyc.com CNAME

# Multiple location testing
curl -H "Host: admin.executivespeechcoachingnyc.com" http://198.51.100.1
nslookup admin.executivespeechcoachingnyc.com 1.1.1.1

# SSL verification
curl -I https://admin.executivespeechcoachingnyc.com
openssl s_client -connect admin.executivespeechcoachingnyc.com:443 -servername admin.executivespeechcoachingnyc.com
```

**Automated propagation monitoring:**
```bash
#!/bin/bash
# dns-check.sh - Monitor DNS propagation

DOMAIN="admin.executivespeechcoachingnyc.com"
DNS_SERVERS=("1.1.1.1" "8.8.8.8" "208.67.222.222" "9.9.9.9")

for server in "${DNS_SERVERS[@]}"; do
    echo "Checking $server..."
    dig @$server $DOMAIN CNAME +short
done

# Expected result: dan-reece-executive-coaching.pages.dev
```

#### 6. Redirect Verification
**Testing redirect functionality:**
```bash  
# WWW to apex redirect
curl -I http://www.executivespeechcoachingnyc.com
# Expected: 301 redirect to https://executivespeechcoachingnyc.com

curl -I https://www.executivespeechcoachingnyc.com  
# Expected: 301 redirect to https://executivespeechcoachingnyc.com

# HTTP to HTTPS redirect
curl -I http://executivespeechcoachingnyc.com
# Expected: 301 redirect to https://executivespeechcoachingnyc.com

curl -I http://admin.executivespeechcoachingnyc.com
# Expected: 301 redirect to https://admin.executivespeechcoachingnyc.com
```

### 📊 Performance Impact Assessment
**DNS Query Performance:**
```bash
# Measure DNS resolution time
time nslookup executivespeechcoachingnyc.com
time nslookup admin.executivespeechcoachingnyc.com

# Target: <50ms response time globally
# Cloudflare's anycast network should provide <10ms in most locations
```

### 🔒 Security Validation
**SSL Configuration Testing:**
```bash
# SSL Labs rating check
curl -s "https://api.ssllabs.com/api/v3/analyze?host=admin.executivespeechcoachingnyc.com"

# Security headers verification
curl -I https://admin.executivespeechcoachingnyc.com | grep -E "(Strict-Transport|X-Frame|X-Content)"

# Expected headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### ⚡ Advanced DNS Features
**CAA Records for Certificate Authority Authorization:**
```dns
CAA executivespeechcoachingnyc.com → 0 issue "digicert.com"
CAA executivespeechcoachingnyc.com → 0 issue "letsencrypt.org"  
CAA executivespeechcoachingnyc.com → 0 iodef "mailto:admin@executivespeechcoachingnyc.com"
```

**DNSSEC Configuration:**
```yaml
DNSSEC Status: Enabled
Algorithm: RSASHA256
Key Tag: [Generated by Cloudflare]
Public Key: [Provided by Cloudflare DNS]
```

### 🧪 Email Routing Testing
```bash
# Test email delivery preservation
echo "Test email" | mail -s "DNS Migration Test" dan@executivespeechcoachingnyc.com

# Check SPF record
dig TXT executivespeechcoachingnyc.com | grep "v=spf1"

# Verify DMARC policy  
dig TXT _dmarc.executivespeechcoachingnyc.com

# MX record verification
dig MX executivespeechcoachingnyc.com +short
```

### 📈 Monitoring Setup
**DNS monitoring endpoints:**
```yaml
# Add to monitoring system
Endpoints:
  - https://executivespeechcoachingnyc.com (Main site)
  - https://www.executivespeechcoachingnyc.com (Redirect test)
  - https://admin.executivespeechcoachingnyc.com (Admin subdomain)
  
Checks:
  - DNS resolution time
  - SSL certificate expiry  
  - HTTP response codes
  - Redirect functionality

Alerts:
  - DNS resolution fails
  - SSL certificate expires in 30 days
  - Response time > 2 seconds
  - Redirect chains broken
```

### 📝 Configuration Backup
**DNS record backup for disaster recovery:**
```json
{
  "domain": "executivespeechcoachingnyc.com",
  "records": [
    {"type": "A", "name": "@", "content": "192.0.2.1", "proxied": true},
    {"type": "CNAME", "name": "www", "content": "executivespeechcoachingnyc.com", "proxied": true},
    {"type": "CNAME", "name": "admin", "content": "dan-reece-executive-coaching.pages.dev", "proxied": true},
    {"type": "MX", "name": "@", "content": "mail.provider.com", "priority": 10},
    {"type": "TXT", "name": "@", "content": "v=spf1 include:_spf.provider.com ~all"}
  ]
}
```

### 🔗 Integration Preparation  
**Ready for Epic Dependencies:**
- **Epic 002**: Admin subdomain configured for D1 Manager deployment
- **Epic 003**: API subdomain reserved for Workers endpoints
- **Epic 004**: Security policies in place for admin access
- **Epic 005**: CDN subdomain available for performance optimization

### ✅ Success Checklist
- [ ] All DNS records propagated globally (<15 minutes)
- [ ] SSL certificates valid for all subdomains
- [ ] WWW to apex redirects working (301 status)
- [ ] HTTP to HTTPS redirects working  
- [ ] Admin subdomain accessible with enhanced security
- [ ] Email delivery functioning normally
- [ ] DNS resolution time <50ms globally
- [ ] SSL Labs grade A+ for all domains
- [ ] Firewall rules active for admin subdomain
- [ ] Rate limiting configured and tested

### 📋 Documentation for Operations Team
- DNS configuration documented in repository
- Emergency contact information for DNS provider
- Rollback procedures for DNS changes
- Monitoring dashboard access instructions
- SSL certificate renewal automation verified