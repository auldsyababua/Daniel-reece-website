---
title: "Payment Successful"
date: 2024-01-01T00:00:00-05:00
draft: false
layout: "payment-status"
---

# Payment Successfully Authorized

Thank you for your payment! Your session has been scheduled and payment will be processed on the day of your session.

## What Happens Next?

1. **Confirmation Email**: You'll receive a confirmation email shortly with your session details
2. **Calendar Invite**: A calendar invitation will be sent within 24 hours
3. **Preparation Materials**: You'll receive preparation materials 3 days before your session
4. **Payment Processing**: Your payment will be automatically processed on the day of your session

## Session Details

<div id="session-details" class="session-info">
  <p>Loading your session information...</p>
</div>

## Need to Make Changes?

If you need to reschedule or have any questions about your session, please contact us:

- **Email**: daniel@executivespeechcoachingnyc.com
- **Phone**: (917) 300-9337

<script>
// Display session details from checkout
document.addEventListener('DOMContentLoaded', function() {
  const pendingCheckout = sessionStorage.getItem('pendingCheckout');
  if (pendingCheckout) {
    const data = JSON.parse(pendingCheckout);
    const detailsEl = document.getElementById('session-details');
    
    detailsEl.innerHTML = `
      <div class="detail-row">
        <strong>Session Date:</strong> ${new Date(data.captureDate).toLocaleDateString()}
      </div>
      <div class="detail-row">
        <strong>Package Type:</strong> ${data.packageType.charAt(0).toUpperCase() + data.packageType.slice(1)}
      </div>
      <div class="detail-row">
        <strong>Payment Status:</strong> Authorized (will be captured on session date)
      </div>
      <div class="detail-row">
        <strong>Reference:</strong> ${data.sessionId.slice(0, 8)}...
      </div>
    `;
    
    // Clear session storage
    sessionStorage.removeItem('pendingCheckout');
  }
});
</script>