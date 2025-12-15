# Contact Form Setup Instructions

## Overview
The contact form has been configured to send emails to **contactus@blaseek.com** using Formspree, a free third-party service perfect for static websites.

## Setup Steps

### 1. Create a Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Click "New Form" or "+ New Project"
4. Create a new form project

### 2. Get Your Form Endpoint
1. After creating the form, Formspree will give you a unique endpoint URL
2. It will look like: `https://formspree.io/f/YOUR_FORM_ID`
3. Copy this URL

### 3. Update the Website
1. Open `index.html`
2. Find line 443 where the form tag is:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Replace `YOUR_FORM_ID` with your actual Formspree form ID

### 4. Configure Email Settings in Formspree Dashboard
1. In your Formspree dashboard, configure:
   - **Email Notifications**: Set to `contactus@blaseek.com`
   - **Spam Filter**: Enable (already includes honeypot in the form)
   - **reCAPTCHA**: Enable if you want extra protection (optional)

## Features Implemented

✅ **All form fields have proper name attributes**:
- firstName, lastName, email, phone, company, interest, message

✅ **Email Configuration**:
- `_replyto`: contactus@blaseek.com (allows you to reply directly to the sender)
- `_subject`: "New Contact Form Submission from Blaseek Website"

✅ **Spam Protection**:
- Honeypot field (`_gotcha`) - invisible spam trap

✅ **User Experience**:
- Loading state: Button shows "Sending..." while submitting
- Success message: Shows confirmation for 5 seconds then auto-hides
- Error handling: Shows user-friendly error if submission fails
- Form reset: Automatically clears form after successful submission

✅ **AJAX Submission**:
- No page reload - smooth user experience
- Works with Formspree's API using fetch()

## Testing

### Before going live:
1. Replace `YOUR_FORM_ID` with your actual Formspree ID
2. Submit a test form
3. Check contactus@blaseek.com for the email
4. Verify all fields are captured correctly

### Alternative Option: Use Direct Form Action
If you prefer, you can use Formspree's email-based endpoint (for testing):
```html
<form action="https://formspree.io/contactus@blaseek.com" method="POST">
```
Note: This will require email confirmation the first time someone submits.

## Cost
- **Free tier**: Up to 50 submissions/month
- **Paid plans**: If you need more, starts at $10/month for 1,000 submissions

## support
If you need help setting up Formspree, their documentation is excellent:
https://help.formspree.io/hc/en-us

## Current Status
✅ Form HTML updated with proper fields and attributes
✅ JavaScript updated with async/await and error handling
❗ **Action Required**: Replace `YOUR_FORM_ID` in index.html with your actual Formspree form ID

Once you update the Form ID, the contact form will be fully functional!
