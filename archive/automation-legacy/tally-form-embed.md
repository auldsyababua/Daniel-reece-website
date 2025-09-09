# Tally Form Integration Options

## Option 1: Embed Tally Form Directly (Recommended)

Replace the current contact form with a Tally embed. This provides the best integration with Zapier/Airtable while maintaining professional styling.

### Implementation Steps:

1. **Create the Tally form** following the structure in `zapier-integration-guide.md`
2. **Get the embed code** from Tally (will look like):
```html
<iframe 
  data-tally-src="https://tally.so/r/YOUR-FORM-ID" 
  loading="lazy" 
  width="100%" 
  height="800" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0" 
  title="Executive Coaching Contact Form">
</iframe>
```

3. **Replace the form section** in `/content/contact.md`:

```html
<!-- Replace the existing form section with: -->
<div class="max-w-4xl px-4 pt-6 pb-16 mx-auto">
    <div class="max-w-3xl mx-auto">
        <div class="mb-12 text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-brand-navy-900 dark:text-white mb-6">Let's Start Your Communication Journey</h2>
            <p class="text-lg text-brand-navy-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get personalized coaching recommendations and a free 15-minute consultation to transform your executive presence.
            </p>
            <!-- Trust badges remain the same -->
            <div class="flex flex-wrap items-center justify-center gap-6 mt-6">
                <!-- Keep existing trust indicators -->
            </div>
        </div>
        
        <!-- Tally Form Embed -->
        <div class="bg-white dark:bg-brand-navy-900/50 rounded-2xl border border-brand-navy-200 dark:border-brand-navy-700 shadow-brand overflow-hidden">
            <iframe 
                data-tally-src="https://tally.so/r/YOUR-FORM-ID" 
                loading="lazy" 
                width="100%" 
                height="800" 
                frameborder="0" 
                marginheight="0" 
                marginwidth="0" 
                title="Executive Coaching Contact Form"
                class="w-full">
            </iframe>
        </div>
    </div>
</div>

<script async src="https://tally.so/widgets/embed.js"></script>
```

---

## Option 2: Hybrid Approach (Keep Existing Design)

Keep your current beautiful form design but update the backend to send data to Zapier webhook.

### Update `/assets/js/contact-form.js`:

```javascript
// Update the handleSubmit function
async handleSubmit(event) {
    event.preventDefault();
    this.clearMessages();
    
    if (!this.validateAll()) {
        return;
    }
    
    this.isSubmitting = true;
    
    try {
        // Prepare data for Zapier webhook
        const formData = {
            name: this.form.name,
            email: this.form.email,
            service: this.form.subject,
            message: this.form.message,
            company: this.form.company || '', // Add company field
            title: this.form.title || '', // Add title field
            submission_date: new Date().toISOString(),
            form_source: 'Website Contact Form'
        };

        // Send to Zapier webhook
        const response = await fetch('https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            this.showSuccess = true;
            this.resetForm();
            
            // Send confirmation email via backup method
            await this.sendBackupEmail(formData);
        } else {
            throw new Error('Webhook failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        this.showError = true;
    } finally {
        this.isSubmitting = false;
    }
},

// Add backup email method
async sendBackupEmail(formData) {
    try {
        const backupFormData = new FormData();
        backupFormData.append('name', formData.name);
        backupFormData.append('email', formData.email);
        backupFormData.append('subject', formData.service);
        backupFormData.append('message', formData.message);
        backupFormData.append('_subject', 'New Contact Form Submission');
        backupFormData.append('_captcha', 'false');
        
        await fetch('https://formsubmit.co/info@executivespeechcoachingnyc.com', {
            method: 'POST',
            body: backupFormData
        });
    } catch (error) {
        console.error('Backup email failed:', error);
    }
}
```

### Add Missing Fields to Contact Form

Update `/content/contact.md` to include company and title fields:

```html
<!-- Add after the email field -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Company Field -->
    <div class="space-y-2">
        <label for="company" class="block text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">
            Company/Organization
        </label>
        <input type="text" 
               id="company"
               name="company" 
               x-model="form.company"
               class="bg-brand-navy-50 dark:bg-brand-navy-800 border border-brand-navy-200 dark:border-brand-navy-600 text-brand-navy-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 block w-full px-4 py-3 transition-all duration-300 placeholder-brand-navy-400 dark:placeholder-brand-navy-500"
               placeholder="Your company name">
    </div>
    
    <!-- Title Field -->
    <div class="space-y-2">
        <label for="title" class="block text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">
            Job Title
        </label>
        <input type="text" 
               id="title"
               name="title" 
               x-model="form.title"
               class="bg-brand-navy-50 dark:bg-brand-navy-800 border border-brand-navy-200 dark:border-brand-navy-600 text-brand-navy-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 block w-full px-4 py-3 transition-all duration-300 placeholder-brand-navy-400 dark:placeholder-brand-navy-500"
               placeholder="e.g. VP of Sales, CEO, Director">
    </div>
</div>
```

---

## Option 3: Netlify Forms (Alternative)

If you prefer to stay with your current hosting setup and avoid external dependencies:

### Update the form in `/content/contact.md`:

```html
<form name="contact" 
      netlify
      netlify-honeypot="bot-field"
      method="POST" 
      class="space-y-6"
      @submit="handleSubmit($event)">
    
    <!-- Netlify spam prevention -->
    <input type="hidden" name="bot-field">
    <input type="hidden" name="form-name" value="contact">
    
    <!-- Keep all your existing form fields -->
    
</form>
```

### Set up Netlify webhook to Zapier:
1. In Netlify dashboard → Forms → Settings  
2. Add webhook URL: `https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED`
3. This will trigger on each form submission

---

## Recommendation

**Go with Option 1 (Tally Embed)** because:
- ✅ Professional appearance with Tally's advanced features
- ✅ Built-in lead qualification questions
- ✅ Native Zapier integration (most reliable)
- ✅ Advanced analytics and A/B testing
- ✅ GDPR/CCPA compliance built-in
- ✅ Mobile optimization
- ✅ No JavaScript dependencies or debugging
- ✅ Conditional logic for better lead qualification

The Tally form can be styled to match your site's design and provides enterprise-level features that will grow with your business.

## Next Steps

1. Create Tally account and build the form
2. Set up Airtable base following the structure document
3. Configure Zapier automation with the provided code
4. Replace contact form with Tally embed
5. Test the complete workflow
6. Monitor and optimize based on lead quality

This integration will transform your lead capture from a simple email form into a professional CRM system that automatically scores, routes, and nurtures leads based on their qualification level.