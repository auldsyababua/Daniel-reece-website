---
title: Contact
draft: false
language: en
description: Get in touch with Elevating Voices for inquiries about coaching, training, and custom programs. Reach out to start your journey toward impactful communication.
layout: "contact"

contact_intro:
  title: "Contact"
---

<!-- @format -->
<div class="max-w-4xl px-4 pt-6 pb-16 mx-auto">
    <div class="max-w-3xl mx-auto">
        <div class="mb-12 text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-brand-navy-900 dark:text-white mb-6">Let's Start Your Communication Journey</h2>
            <p class="text-lg text-brand-navy-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get personalized coaching recommendations and a free 15-minute consultation to transform your executive presence.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-6 mt-6">
                <div class="flex items-center bg-brand-gold-50 dark:bg-brand-gold-900/20 px-4 py-2 rounded-full border border-brand-gold-200 dark:border-brand-gold-800">
                    <svg class="w-5 h-5 mr-2 text-brand-gold-600" fill="currentColor" viewBox="0 0 20 20">
                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                    </svg>
                    <span class="text-sm font-medium text-brand-navy-700 dark:text-brand-gold-300">24-hour response</span>
                </div>
                <div class="flex items-center bg-brand-gold-50 dark:bg-brand-gold-900/20 px-4 py-2 rounded-full border border-brand-gold-200 dark:border-brand-gold-800">
                    <svg class="w-5 h-5 mr-2 text-brand-gold-600" fill="currentColor" viewBox="0 0 20 20">
                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                    </svg>
                    <span class="text-sm font-medium text-brand-navy-700 dark:text-brand-gold-300">100% confidential</span>
                </div>
                <div class="flex items-center bg-brand-gold-50 dark:bg-brand-gold-900/20 px-4 py-2 rounded-full border border-brand-gold-200 dark:border-brand-gold-800">
                    <svg class="w-5 h-5 mr-2 text-brand-gold-600" fill="currentColor" viewBox="0 0 20 20">
                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                    </svg>
                    <span class="text-sm font-medium text-brand-navy-700 dark:text-brand-gold-300">No obligation</span>
                </div>
            </div>
        </div>
        
        <div x-data="contactForm()" x-init="init()">
            <!-- Success Message -->
            <div x-show="showSuccess" x-transition class="mb-8 p-6 bg-gradient-to-r from-green-50 to-brand-gold-50 border border-green-200 rounded-xl shadow-lg dark:from-green-900/20 dark:to-brand-gold-900/20 dark:border-green-600">
                <div class="flex items-center text-green-800 dark:text-green-300">
                    <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Thank you for reaching out!</h3>
                        <p class="text-green-700 dark:text-green-300">Your message has been sent successfully. We'll respond within 24 hours.</p>
                    </div>
                </div>
            </div>

            <!-- Error Message -->
            <div x-show="showError" x-transition class="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-lg dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-600">
                <div class="flex items-center text-red-800 dark:text-red-300">
                    <div class="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mr-4">
                        <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-1">Unable to send message</h3>
                        <p class="text-red-700 dark:text-red-300">There was a problem sending your message. Please try again or contact us directly.</p>
                    </div>
                </div>
            </div>

            <form name="contact" 
                  action="{{ .Site.Params.contact.formsubmit_endpoint }}" 
                  method="POST" 
                  class="space-y-6"
                  @submit="handleSubmit($event)"
                  novalidate>
                
                <!-- FormSubmit Configuration -->
                <input type="hidden" name="_next" value="{{ .Site.BaseURL }}{{ .Site.Params.contact.thank_you_page }}">
                <input type="hidden" name="_subject" value="New Contact Form Submission">
                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="_template" value="table">
                
                <!-- Honeypot field for spam prevention -->
                <input type="text" name="_honey" style="display:none">
                
                <!-- Contact Information Section -->
                <div class="bg-white dark:bg-brand-navy-900/50 p-8 rounded-2xl border border-brand-navy-200 dark:border-brand-navy-700 shadow-brand">
                    <h3 class="text-xl font-bold text-brand-navy-900 dark:text-white mb-6 flex items-center">
                        <div class="w-8 h-8 bg-brand-gold-100 dark:bg-brand-gold-900/30 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-brand-gold-600 dark:text-brand-gold-400" fill="currentColor" viewBox="0 0 20 20">
                                <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                            </svg>
                        </div>
                        Your Information
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Name Field -->
                        <div class="space-y-2">
                            <label for="name" class="block text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">
                                Full Name <span class="text-red-500 ml-1">*</span>
                            </label>
                            <input type="text" 
                                   id="name"
                                   name="name" 
                                   x-model="form.name"
                                   @blur="validateName()"
                                   @input="validateName()"
                                   class="bg-brand-navy-50 dark:bg-brand-navy-800 border border-brand-navy-200 dark:border-brand-navy-600 text-brand-navy-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 block w-full px-4 py-3 transition-all duration-300 placeholder-brand-navy-400 dark:placeholder-brand-navy-500"
                                   :class="{ 
                                       'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20': errors.name,
                                       'border-brand-gold-300 bg-brand-gold-50 dark:bg-brand-gold-900/20': !errors.name && form.name.length > 0
                                   }"
                                   placeholder="Enter your full name" 
                                   required
                                   aria-describedby="name-error">
                            <p x-show="errors.name" x-text="errors.name" class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" id="name-error"></p>
                        </div>
                        
                        <!-- Email Field -->
                        <div class="space-y-2">
                            <label for="email" class="block text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">
                                Email Address <span class="text-red-500 ml-1">*</span>
                            </label>
                            <input type="email" 
                                   id="email"
                                   name="email" 
                                   x-model="form.email"
                                   @blur="validateEmail()"
                                   @input="validateEmail()"
                                   class="bg-brand-navy-50 dark:bg-brand-navy-800 border border-brand-navy-200 dark:border-brand-navy-600 text-brand-navy-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 block w-full px-4 py-3 transition-all duration-300 placeholder-brand-navy-400 dark:placeholder-brand-navy-500"
                                   :class="{ 
                                       'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20': errors.email,
                                       'border-brand-gold-300 bg-brand-gold-50 dark:bg-brand-gold-900/20': !errors.email && form.email.length > 0
                                   }"
                                   placeholder="your.email@company.com" 
                                   required
                                   aria-describedby="email-error">
                            <p x-show="errors.email" x-text="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium" id="email-error"></p>
                        </div>
                    </div>
                </div>
                
                <!-- Coaching Interest Section -->
                <div class="bg-brand-gold-50 dark:bg-brand-gold-900/10 p-8 rounded-2xl border border-brand-gold-200 dark:border-brand-gold-800 shadow-gold">
                    <h3 class="text-xl font-bold text-brand-navy-900 dark:text-white mb-6 flex items-center">
                        <div class="w-8 h-8 bg-brand-gold-500 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                            </svg>
                        </div>
                        What interests you most?
                    </h3>
                    
                    <!-- Subject Field -->
                    <div class="space-y-2">
                        <label for="subject" class="block text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">
                            Choose Your Service <span class="text-red-500 ml-1">*</span>
                        </label>
                        <select id="subject" 
                                name="subject" 
                                x-model="form.subject"
                                class="bg-white dark:bg-brand-navy-800 border border-brand-gold-200 dark:border-brand-navy-600 text-brand-navy-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 block w-full px-4 py-3 transition-all duration-300"
                                required>
                            <option value="">Choose your area of interest...</option>
                            <option value="Discovery Call">🎯 Discovery Call (Free 15-min consultation)</option>
                            <option value="1:1 Speech Coaching">👤 1:1 Executive Speech Coaching</option>
                            <option value="Executive Training Programs">🏢 Executive Training Programs</option>
                            <option value="Group Communication Training">👥 Group Communication Training</option>
                            <option value="General Inquiry">💬 General Questions</option>
                            <option value="Other">📋 Other (please specify in message)</option>
                        </select>
                        <p class="mt-2 text-sm text-brand-navy-600 dark:text-brand-navy-400 bg-white dark:bg-brand-navy-800 px-3 py-2 rounded-lg border border-brand-gold-100 dark:border-brand-navy-700">
                            💡 <strong>Not sure?</strong> Choose "Discovery Call" for a free consultation to discuss your specific needs.
                        </p>
                    </div>
                </div>
                
                <!-- Message Section -->
                <div class="bg-white dark:bg-brand-navy-900/50 p-8 rounded-2xl border border-brand-navy-200 dark:border-brand-navy-700 shadow-brand">
                    <h3 class="text-xl font-bold text-brand-navy-900 dark:text-white mb-6 flex items-center">
                        <div class="w-8 h-8 bg-brand-navy-600 dark:bg-brand-navy-500 rounded-lg flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                            </svg>
                        </div>
                        Tell us about your goals
                    </h3>
                    
                    <div class="space-y-2">
                        <label for="message" class="block text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">
                            Your Message <span class="text-red-500 ml-1">*</span>
                        </label>
                        <textarea id="message" 
                                  name="message" 
                                  rows="6" 
                                  x-model="form.message"
                                  @blur="validateMessage()"
                                  @input="validateMessage()"
                                  class="bg-brand-navy-50 dark:bg-brand-navy-800 border border-brand-navy-200 dark:border-brand-navy-600 text-brand-navy-900 dark:text-white text-base rounded-xl focus:ring-2 focus:ring-brand-gold-500 focus:border-brand-gold-500 block w-full px-4 py-3 transition-all duration-300 placeholder-brand-navy-400 dark:placeholder-brand-navy-500 resize-none"
                                  :class="{ 
                                      'border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20': errors.message,
                                      'border-brand-gold-300 bg-brand-gold-50 dark:bg-brand-gold-900/20': !errors.message && form.message.length > 10
                                  }"
                                  placeholder="Share your communication challenges, goals, or any questions you have. For example: 'I need to improve my presentation skills for board meetings' or 'Our team needs better conflict resolution training.'"
                                  required
                                  aria-describedby="message-error message-help"></textarea>
                        <div class="flex justify-between items-start mt-3">
                            <p x-show="errors.message" x-text="errors.message" class="text-sm text-red-600 dark:text-red-400 font-medium" id="message-error"></p>
                            <div class="text-right">
                                <p class="text-sm text-brand-navy-500 dark:text-brand-navy-400" id="message-help">
                                    <span x-text="form.message.length" class="font-medium"></span><span class="text-brand-navy-400">/500 characters</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Submit Button and Trust Signals -->
                <div class="space-y-6">
                    <!-- Trust indicators -->
                    <div class="bg-gradient-to-r from-green-50 to-brand-gold-50 dark:from-green-900/20 dark:to-brand-gold-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-sm">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div class="flex flex-col items-center text-center">
                                <div class="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                                    </svg>
                                </div>
                                <span class="text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">SSL Secured</span>
                                <span class="text-xs text-brand-navy-600 dark:text-brand-navy-400">Bank-level encryption</span>
                            </div>
                            <div class="flex flex-col items-center text-center">
                                <div class="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                                    </svg>
                                </div>
                                <span class="text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">No Spam</span>
                                <span class="text-xs text-brand-navy-600 dark:text-brand-navy-400">Quality over quantity</span>
                            </div>
                            <div class="flex flex-col items-center text-center">
                                <div class="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 2L3 7v11c0 5.55 3.84 9.93 9 11 5.16-1.07 9-5.45 9-11V7l-7-5z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                                    </svg>
                                </div>
                                <span class="text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">Privacy First</span>
                                <span class="text-xs text-brand-navy-600 dark:text-brand-navy-400">Your data is safe</span>
                            </div>
                            <div class="flex flex-col items-center text-center">
                                <div class="w-12 h-12 bg-brand-gold-100 dark:bg-brand-gold-800 rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-6 h-6 text-brand-gold-600 dark:text-brand-gold-400" fill="currentColor" viewBox="0 0 20 20">
                                        <REDACTED_AIRTABLE_PAT fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></REDACTED_AIRTABLE_PAT>
                                    </svg>
                                </div>
                                <span class="text-sm font-semibold text-brand-navy-800 dark:text-brand-navy-200">Quick Response</span>
                                <span class="text-xs text-brand-navy-600 dark:text-brand-navy-400">Within 24 hours</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Submit button -->
                    <div class="text-center">
                        <button type="submit" 
                                :disabled="isSubmitting || !isFormValid()"
                                class="w-full md:w-auto inline-flex items-center justify-center bg-brand-gradient hover:shadow-brand-lg text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-brand transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-brand-gold-300 dark:focus:ring-brand-gold-600">
                            <span x-show="!isSubmitting" class="flex items-center">
                                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <REDACTED_AIRTABLE_PAT stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></REDACTED_AIRTABLE_PAT>
                                </svg>
                                Send My Message
                            </span>
                            <span x-show="isSubmitting" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <REDACTED_AIRTABLE_PAT class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></REDACTED_AIRTABLE_PAT>
                                </svg>
                                Sending Message...
                            </span>
                        </button>
                        <p class="mt-4 text-sm text-brand-navy-600 dark:text-brand-navy-400 max-w-md mx-auto">
                            By submitting this form, you agree to receive communications from us. 
                            <br class="hidden sm:inline">
                            <span class="font-medium">You can unsubscribe at any time.</span>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
