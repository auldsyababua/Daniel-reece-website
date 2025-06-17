// Stripe Checkout Integration
class StripeCheckout {
  constructor() {
    this.stripe = null;
    this.init();
  }

  init() {
    // Initialize Stripe with publishable key
    if (typeof Stripe !== 'undefined' && window.STRIPE_PUBLISHABLE_KEY) {
      this.stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
    } else {
      console.error('Stripe.js not loaded or publishable key not set');
    }
  }

  async createCheckoutSession(options) {
    try {
      // Show loading state
      this.showLoading(true);

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Store session data for tracking
      sessionStorage.setItem('pendingCheckout', JSON.stringify({
        sessionId: data.sessionId,
        paymentIntentId: data.paymentIntentId,
        captureDate: data.captureDate,
        clientId: options.clientId,
        packageType: options.packageType
      }));

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      this.showError(error.message);
    } finally {
      this.showLoading(false);
    }
  }

  // Helper to create checkout for single session
  async checkoutSingleSession(sessionDate, clientInfo) {
    await this.createCheckoutSession({
      priceId: window.STRIPE_PRICE_SESSION,
      clientId: clientInfo.id,
      sessionDate: sessionDate,
      packageType: 'single',
      customerEmail: clientInfo.email,
      customerName: clientInfo.name,
      successUrl: window.location.origin + '/payment-success',
      cancelUrl: window.location.origin + '/payment-cancelled'
    });
  }

  // Helper to create checkout for packages
  async checkoutPackage(packageType, paymentPlan, clientInfo, sessionDate) {
    const priceMap = {
      launch: {
        full: window.STRIPE_PRICE_LAUNCH,
        '2-pay': window.STRIPE_PRICE_LAUNCH_PAYMENT_PLAN
      },
      scale: {
        full: window.STRIPE_PRICE_SCALE,
        '3-pay': window.STRIPE_PRICE_SCALE_PAYMENT_PLAN
      },
      startup: {
        full: window.STRIPE_PRICE_STARTUP,
        '2-pay': window.STRIPE_PRICE_STARTUP_PAYMENT_PLAN
      },
      venture: {
        full: window.STRIPE_PRICE_VENTURE,
        '3-pay': window.STRIPE_PRICE_VENTURE_PAYMENT_PLAN
      },
      enterprise: {
        full: window.STRIPE_PRICE_ENTERPRISE,
        '3-pay': window.STRIPE_PRICE_ENTERPRISE_PAYMENT_PLAN
      }
    };

    const priceId = priceMap[packageType]?.[paymentPlan];
    if (!priceId) {
      throw new Error('Invalid package or payment plan');
    }

    await this.createCheckoutSession({
      priceId: priceId,
      clientId: clientInfo.id,
      sessionDate: sessionDate,
      packageType: packageType,
      paymentPlan: paymentPlan,
      customerEmail: clientInfo.email,
      customerName: clientInfo.name,
      teamSize: clientInfo.teamSize,
      successUrl: window.location.origin + '/payment-success',
      cancelUrl: window.location.origin + '/payment-cancelled'
    });
  }

  showLoading(show) {
    const loadingEl = document.getElementById('checkout-loading');
    if (loadingEl) {
      loadingEl.style.display = show ? 'block' : 'none';
    }
  }

  showError(message) {
    const errorEl = document.getElementById('checkout-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 5000);
    } else {
      alert('Error: ' + message);
    }
  }
}

// Initialize on page load
window.stripeCheckout = new StripeCheckout();

// Package selection UI
class PackageSelector {
  constructor() {
    this.selectedPackage = null;
    this.selectedPlan = 'full';
    this.init();
  }

  init() {
    // Attach event listeners to package cards
    document.querySelectorAll('[data-package-type]').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectPackage(card.dataset.packageType);
      });
    });

    // Attach event listeners to payment plan toggles
    document.querySelectorAll('[data-payment-plan]').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        this.selectedPlan = e.target.value;
        this.updatePricing();
      });
    });
  }

  selectPackage(packageType) {
    this.selectedPackage = packageType;
    
    // Update UI
    document.querySelectorAll('[data-package-type]').forEach(card => {
      card.classList.toggle('selected', card.dataset.packageType === packageType);
    });

    // Show payment options
    this.showPaymentOptions(packageType);
  }

  showPaymentOptions(packageType) {
    const packages = {
      launch: {
        price: 1800,
        plans: ['full', '2-pay'],
        planPrices: { full: 1800, '2-pay': 900 }
      },
      scale: {
        price: 2250,
        plans: ['full', '3-pay'],
        planPrices: { full: 2250, '3-pay': 750 }
      },
      startup: {
        price: 3000,
        plans: ['full', '2-pay'],
        planPrices: { full: 3000, '2-pay': 1500 }
      },
      venture: {
        price: 3750,
        plans: ['full', '3-pay'],
        planPrices: { full: 3750, '3-pay': 1250 }
      },
      enterprise: {
        price: 4375,
        plans: ['full', '3-pay'],
        planPrices: { full: 4375, '3-pay': 1458 }
      }
    };

    const pkg = packages[packageType];
    if (!pkg) return;

    // Update payment options UI
    const optionsEl = document.getElementById('payment-options');
    if (optionsEl) {
      optionsEl.innerHTML = this.renderPaymentOptions(packageType, pkg);
      this.attachPaymentOptionListeners();
    }
  }

  renderPaymentOptions(packageType, pkg) {
    return `
      <div class="payment-options">
        <h3>Payment Options for ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package</h3>
        <div class="payment-plans">
          ${pkg.plans.map(plan => `
            <label class="payment-plan">
              <input type="radio" name="payment-plan" value="${plan}" ${plan === 'full' ? 'checked' : ''}>
              <span class="plan-details">
                ${plan === 'full' ? 'Pay in Full' : `${plan.replace('-', ' ')} Payments`}
                <span class="plan-price">
                  ${plan === 'full' 
                    ? `$${pkg.planPrices[plan].toLocaleString()}` 
                    : `$${pkg.planPrices[plan].toLocaleString()}/month`
                  }
                </span>
              </span>
            </label>
          `).join('')}
        </div>
        <button class="checkout-button" onclick="proceedToCheckout()">
          Proceed to Checkout
        </button>
      </div>
    `;
  }

  attachPaymentOptionListeners() {
    document.querySelectorAll('input[name="payment-plan"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.selectedPlan = e.target.value;
      });
    });
  }

  updatePricing() {
    // Update displayed prices based on selected plan
    // Implementation depends on your UI structure
  }

  getSelection() {
    return {
      package: this.selectedPackage,
      plan: this.selectedPlan
    };
  }
}

// Initialize package selector
window.packageSelector = new PackageSelector();

// Global checkout function
window.proceedToCheckout = async function() {
  const selection = window.packageSelector.getSelection();
  if (!selection.package) {
    alert('Please select a package');
    return;
  }

  // Get client info (this would come from your form or session)
  const clientInfo = {
    id: document.getElementById('client-id')?.value || 'test-client',
    name: document.getElementById('client-name')?.value || 'Test Client',
    email: document.getElementById('client-email')?.value || 'test@example.com',
    teamSize: document.getElementById('team-size')?.value
  };

  // Get session date (this would come from your booking system)
  const sessionDate = document.getElementById('session-date')?.value || 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  try {
    await window.stripeCheckout.checkoutPackage(
      selection.package,
      selection.plan,
      clientInfo,
      sessionDate
    );
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};