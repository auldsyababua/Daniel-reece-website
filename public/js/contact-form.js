(() => {
  // <stdin>
  function contactForm() {
    return {
      form: {
        name: "",
        email: "",
        subject: "",
        message: ""
      },
      errors: {},
      isSubmitting: false,
      showSuccess: false,
      showError: false,
      init() {
        this.clearMessages();
      },
      validateName() {
        const name = this.form.name.trim();
        if (!name) {
          this.errors.name = "Please enter your name so we know how to address you";
          return false;
        }
        if (name.length < 2) {
          this.errors.name = "Please enter your full name (at least 2 characters)";
          return false;
        }
        if (name.length > 50) {
          this.errors.name = "Name is too long (maximum 50 characters)";
          return false;
        }
        delete this.errors.name;
        return true;
      },
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = this.form.email.trim();
        if (!email) {
          this.errors.email = "We need your email address to respond to your inquiry";
          return false;
        }
        if (!emailRegex.test(email)) {
          this.errors.email = "Please enter a valid email address (e.g., name@company.com)";
          return false;
        }
        if (email.length > 100) {
          this.errors.email = "Email address is too long (maximum 100 characters)";
          return false;
        }
        delete this.errors.email;
        return true;
      },
      validateMessage() {
        const message = this.form.message.trim();
        if (!message) {
          this.errors.message = "Please tell us about your communication goals or questions";
          return false;
        }
        if (message.length < 10) {
          this.errors.message = `Please provide more details (${10 - message.length} more characters needed)`;
          return false;
        }
        if (message.length > 500) {
          this.errors.message = `Message is too long (${message.length - 500} characters over limit)`;
          return false;
        }
        delete this.errors.message;
        return true;
      },
      validateSubject() {
        if (!this.form.subject) {
          this.errors.subject = "Please select a service area to help us route your inquiry";
          return false;
        }
        delete this.errors.subject;
        return true;
      },
      validateAll() {
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isSubjectValid = this.validateSubject();
        const isMessageValid = this.validateMessage();
        return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
      },
      isFormValid() {
        return this.form.name.trim() && this.form.email.trim() && this.form.subject && this.form.message.trim() && Object.keys(this.errors).length === 0;
      },
      getFormCompletionPercentage() {
        let completed = 0;
        const total = 4;
        if (this.form.name.trim() && !this.errors.name) completed++;
        if (this.form.email.trim() && !this.errors.email) completed++;
        if (this.form.subject) completed++;
        if (this.form.message.trim() && !this.errors.message) completed++;
        return Math.round(completed / total * 100);
      },
      async handleSubmit(event) {
        event.preventDefault();
        this.clearMessages();
        if (!this.validateAll()) {
          return;
        }
        this.isSubmitting = true;
        try {
          const formData = {
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            subject: this.form.subject,
            message: this.form.message.trim(),
            source: "Website Contact Form",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          const zapierWebhookUrl = window.ZAPIER_WEBHOOK_URL || null;
          if (zapierWebhookUrl && zapierWebhookUrl !== "YOUR_WEBHOOK_URL_HERE") {
            await this.sendToZapier(zapierWebhookUrl, formData);
          }
          const formSubmitData = new FormData(event.target);
          const response = await fetch(event.target.action, {
            method: "POST",
            body: formSubmitData
          });
          if (response.ok || response.type === "opaque") {
            this.showSuccess = true;
            setTimeout(() => {
              this.resetForm();
              window.location.href = "/contact/thank-you/";
            }, 1500);
          } else {
            throw new Error("Form submission failed");
          }
        } catch (error) {
          console.error("Form submission error:", error);
          this.showError = true;
        } finally {
          this.isSubmitting = false;
        }
      },
      async sendToZapier(webhookUrl, data) {
        console.log("Sending to Zapier webhook:", webhookUrl);
        console.log("Form data:", data);
        const methods = [
          // Method 1: POST with no-cors (most reliable)
          () => this.sendPostNoCORS(webhookUrl, data),
          // Method 2: GET with query parameters (bypasses CORS preflight)
          () => this.sendGetRequest(webhookUrl, data),
          // Method 3: Form submission approach
          () => this.sendViaForm(webhookUrl, data),
          // Method 4: Image beacon (works even if page unloads)
          () => this.sendViaImage(webhookUrl, data)
        ];
        for (let i = 0; i < methods.length; i++) {
          try {
            await methods[i]();
            console.log(`Zapier method ${i + 1} completed`);
            if (i < methods.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.log(`Zapier method ${i + 1} failed:`, error);
          }
        }
      },
      async sendPostNoCORS(webhookUrl, data) {
        return fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
          mode: "no-cors"
        });
      },
      async sendGetRequest(webhookUrl, data) {
        const params = new URLSearchParams();
        Object.keys(data).forEach((key) => {
          params.append(key, data[key]);
        });
        const getUrl = webhookUrl + "?" + params.toString();
        return fetch(getUrl, {
          method: "GET",
          mode: "no-cors"
        });
      },
      async sendViaForm(webhookUrl, data) {
        return new Promise((resolve) => {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = webhookUrl;
          form.style.display = "none";
          form.target = "_blank";
          Object.keys(data).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
          });
          document.body.appendChild(form);
          form.submit();
          setTimeout(() => {
            document.body.removeChild(form);
            resolve();
          }, 1e3);
        });
      },
      async sendViaImage(webhookUrl, data) {
        return new Promise((resolve, reject) => {
          const params = new URLSearchParams();
          Object.keys(data).forEach((key) => {
            params.append(key, data[key]);
          });
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(() => resolve(), 5e3);
          img.src = webhookUrl + "?" + params.toString();
        });
      },
      clearMessages() {
        this.showSuccess = false;
        this.showError = false;
      },
      resetForm() {
        this.form = {
          name: "",
          email: "",
          subject: "",
          message: ""
        };
        this.errors = {};
        this.isSubmitting = false;
      }
    };
  }
  function newsletterForm() {
    return {
      email: "",
      isSubmitting: false,
      showSuccess: false,
      showError: false,
      errorMessage: "",
      init() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("newsletter") === "success") {
          this.showSuccess = true;
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      },
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email.trim()) {
          this.errorMessage = "Email is required";
          return false;
        }
        if (!emailRegex.test(this.email.trim())) {
          this.errorMessage = "Please enter a valid email address";
          return false;
        }
        this.errorMessage = "";
        return true;
      },
      async handleSubmit(event) {
        event.preventDefault();
        this.clearMessages();
        if (!this.validateEmail()) {
          this.showError = true;
          return;
        }
        this.isSubmitting = true;
        try {
          const formData = new FormData();
          formData.append("email", this.email);
          formData.append("_subject", "Newsletter Subscription");
          formData.append("_captcha", "false");
          formData.append("_template", "table");
          const response = await fetch(event.target.action, {
            method: "POST",
            body: formData
          });
          if (response.ok) {
            this.showSuccess = true;
            this.email = "";
          } else {
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          this.showError = true;
          this.errorMessage = "There was a problem with your subscription. Please try again.";
        } finally {
          this.isSubmitting = false;
        }
      },
      clearMessages() {
        this.showSuccess = false;
        this.showError = false;
        this.errorMessage = "";
      }
    };
  }
  window.contactForm = contactForm;
  window.newsletterForm = newsletterForm;
  document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("contact") === "success") {
      const successElement = document.querySelector('[x-show="showSuccess"]');
      if (successElement) {
        successElement.style.display = "block";
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
})();
