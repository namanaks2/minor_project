# Payment Page Setup Guide

## Overview
A complete checkout payment page has been created for your campus merchandise store. This page handles cart review, customer information collection, and payment processing.

## Files Modified/Created

### 1. **payment.html** (Created)
Complete payment page with:
- **Order Summary Section**
  - Display of all cart items with images and prices
  - Itemized pricing with subtotal, tax (18% GST), and total
  - Sticky positioning on desktop

- **Checkout Form Section**
  - Contact Information (email, phone)
  - Shipping Address (full name, street, city, state, pincode, country)
  - Billing Address (same as shipping option)
  - Payment Methods:
    - 💳 Credit/Debit Card (with card details form)
    - 📱 UPI (with UPI ID field)
    - 🏦 Net Banking (with bank selection)
  - Promo Code Application
  - Terms & Conditions Acceptance
  - Place Order & Continue Shopping buttons

### 2. **script.js** (Updated)
Added cart persistence and checkout redirect:
- `saveCartToLocalStorage()` - Saves cart to browser storage
- Updated `addToCart()` to save cart after adding items
- Updated `changeQty()` to save cart after quantity changes
- Updated `removeFromCart()` to save cart after removing items
- Checkout button now redirects to `payment.html` instead of just clearing cart

## How It Works

### Cart Flow
1. **User adds items** → Saved to localStorage
2. **User clicks "Checkout"** → Redirected to payment.html
3. **Payment page loads** → Reads cart from localStorage
4. **User fills form** → Enters contact and shipping details
5. **User selects payment method** → Chooses preferred payment option
6. **User submits order** → Order data logged (ready for backend integration)
7. **Redirect to home** → Cart cleared, user returned to shop

### localStorage Structure
```javascript
// Cart stored as JSON array
[
  {
    id: 1,
    name: "Campus Hoodie",
    price: 999,
    cat: "Apparel",
    img: "campus hoodie.jfif",
    qty: 2
  },
  ...
]
```

## Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Theme Support** - Dark/light theme toggle in navbar
✅ **Order Summary** - Sticky summary on desktop, scrollable on mobile
✅ **Multiple Payment Options** - Credit card, UPI, Net Banking
✅ **Promo Code Support** - Built-in promo code validation
✅ **Form Validation** - Required fields with error handling
✅ **Toast Notifications** - User feedback for actions
✅ **localStorage Persistence** - Cart survives page refreshes

## Promo Codes (Built-in)
- `WELCOME10` - 10% off
- `STUDENT20` - 20% off
- `BULK50` - 50% off

## Next Steps for Production

### Backend Integration
1. Create `/api/orders` endpoint to save orders
2. Update form submission in payment.html:
```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

### Payment Gateway Integration
Add Razorpay, Stripe, or preferred payment gateway:
- Replace placeholder payment methods with real gateway
- Handle payment verification
- Update order status based on payment response

### Email Notifications
- Send order confirmation email to customer
- Send order notification to admin
- Use backend email service (Nodemailer, SendGrid, etc.)

## Testing

1. **Add items to cart** on home.html
2. **Click checkout** in cart sidebar
3. **Fill out all fields** in payment form
4. **Try different payment methods** - forms update dynamically
5. **Apply promo codes** - test WELCOME10, STUDENT20, etc.
6. **Submit order** - should show success message and redirect

## Mobile Optimization
- Grid layout switches to single column on tablets/phones
- Payment methods display as single column on mobile
- Sticky summary becomes normal flow on mobile
- All inputs are touch-friendly with adequate spacing

## CSS Classes Reference
- `.checkout-container` - Main container
- `.checkout-wrapper` - Two-column grid layout
- `.order-summary` - Left sidebar with items
- `.checkout-form-section` - Right column with form
- `.payment-methods` - Payment option grid
- `.payment-method` - Individual payment option
- `.form-section` - Grouped form fields
- `.btn-place-order` - Primary action button

## Notes
- Cart persists even if user navigates away
- Clearing localStorage manually will reset cart
- Current implementation logs order to console (no backend yet)
- All price calculations done client-side (update taxes as needed)
