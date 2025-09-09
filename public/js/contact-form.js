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
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              this.showSuccess = true;
              setTimeout(() => {
                this.resetForm();
                window.location.href = "/contact/thank-you/";
              }, 1500);
            } else {
              throw new Error(result.message || "Form submission failed");
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Server error occurred");
          }
        } catch (error) {
          console.error("Form submission error:", error);
          this.showError = true;
        } finally {
          this.isSubmitting = false;
        }
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
          window.history.replaceState({}, document.title, window.location.REDACTED_AIRTABLE_PAT);
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
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email: this.email.trim(),
              source: "Newsletter Signup",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            })
          });
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              this.showSuccess = true;
              this.email = "";
            } else {
              throw new Error(result.message || "Newsletter subscription failed");
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Server error occurred");
          }
        } catch (error) {
          this.showError = true;
          this.errorMessage = error.message || "There was a problem with your subscription. Please try again.";
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
      window.history.replaceState({}, document.title, window.location.REDACTED_AIRTABLE_PAT);
    }
  });
})();
