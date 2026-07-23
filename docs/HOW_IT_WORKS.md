# How It Works — What's Real vs. What's Mocked

## 1. The Core Question

**"This looks like a checkout page I could build with just HTML, CSS, and images — so what part of it is actually real, and what part could be faked?"**

If you look at the checkout card on this page, it's true: the order summary, the product attribute options (Size, Color), the plan radio buttons, and the dark blue styling are just normal HTML and CSS. Anyone with basic web development skills could build a page that *looks* like this in an afternoon.

So what makes this a real Google Pay integration rather than a static design mockup?

---

## 2. What Genuinely Can't Be Faked (and Why)

When you select your options and click the **"Buy with GPay"** button, a secure payment popup appears over the screen.

**That popup cannot be faked by this project.**

Here is why:
- The popup is not part of this website's HTML, CSS, or code.
- It is rendered live by Google's official script (`https://pay.google.com/gp/p/js/pay.js`), fetched directly from Google's own servers.
- This website cannot style, inspect, or modify what is inside that popup. It runs in a separate, secure Google browser context (conceptually like an embedded window from Google itself).

A fake mockup website could draw a fake popup box using HTML and CSS, but it could never trigger that official Google interface. Rendering that specific payment sheet requires sending a real, cryptographically signed API request that only Google's servers can recognize and fulfill.

---

## 3. Step-by-Step Request/Response Flow

Here is exactly what happens under the hood when a shopper uses this page, step by step:

1. **Page Loads → `isReadyToPay()` (GENUINE NETWORK CALL)**
   - The browser loads Google's official library (`pay.js`).
   - The application calls `isReadyToPay()`, which sends a live network request to Google asking: *"Does this browser/user support Google Pay?"*
   - Google responds live, confirming readiness.

2. **Button Renders → `createButton()` (GENUINE GOOGLE SDK CALL)**
   - Google's JS library dynamically injects the official, branded "Buy with Google Pay" button onto the page.

3. **User Clicks Button → `loadPaymentData()` (GENUINE NETWORK CALL)**
   - The app constructs a `PaymentDataRequest` object (specifying price, currency, card networks, and required guest details).
   - The application calls `loadPaymentData()`, which sends a real network request directly to Google.
   - At this exact moment, control is handed over to Google.

4. **Google Payment Sheet Opens (GENUINE GOOGLE SERVER UI)**
   - Google's servers open the official payment sheet popup over the page.
   - The shopper selects a test payment card, chooses or enters shipping/contact info, and approves the transaction.
   - Nothing in this project's HTML or JavaScript controls or sees this interaction while it is happening.

5. **Payload Handshake (GENUINE GOOGLE RESPONSE)**
   - After confirmation, Google's servers process the request and return an encrypted, tokenized response payload directly back to the browser.
   - The response contains an opaque payment token along with the approved card details and contact signals.

---

## 4. What "TEST Environment" Means (Precisely)

The phrase **"TEST environment"** is the most common point of confusion for first-time readers.

TEST environment does **not** mean "fake," "simulated," or "mocked."

It means a **real, live, fully functional parallel system** operated by Google specifically for developers.
- It uses the **same real API calls**.
- It uses the **same real Google payment sheet popup**.
- It uses the **same real response format and security protocols** as production.

The only differences are:
1. No real money changes hands (test cards are used).
2. It does not require Google's formal business merchant approval to run locally.

**In short:** The word "TEST" describes *which universe* the real conversation with Google happens in — not whether the conversation itself is real.

---

## 5. What "(simulated)" Means (and How It Differs from TEST Mode)

In the review modal on this page, you might see labels like `(simulated)` next to a card funding source or a shipping address.

**"Simulated" is a completely separate concept from TEST mode.**

- **TEST mode** is the live connection to Google's test servers (always active).
- **"(simulated)"** is a fallback mechanism built into *this project's own code* for missing data fields.

Sometimes, when using Google's TEST environment, a test payment card payload might omit a specific field (for example, omitting `cardFundingSource` or a detailed shipping address). When that happens:
- This project's code detects the missing field.
- It logs a clear warning in the browser console: `[Google Pay Checkout Warning] field missing from PaymentData payload. Falling back to simulated value...`
- It fills in a temporary placeholder (like `CREDIT` or `123 Innovation Way`) so the checkout demonstration can still finish gracefully.
- It explicitly labels that specific row with **`(simulated)`** on the screen so nobody mistakes the placeholder for real data returned by Google.

**Key Rule:** `"simulated"` refers to individual missing data fields being backfilled by this website's fallback logic — never to the Google Pay API connection itself, which is always 100% real.

---

## 6. Summary: Real vs. Filled In

| Layer / Feature | Real or filled in by this project? |
| :--- | :--- |
| **Page Layout & Order Summary UI** | Built by this project (HTML/CSS) |
| **Google Pay Button & Payment Sheet Popup** | **Real** (Rendered live by Google's SDK) |
| **`isReadyToPay()` & `loadPaymentData()` Network Calls** | **Real** (Live API calls to Google's servers) |
| **Payment Token & Response Payload Structure** | **Real** (Generated by Google's infrastructure) |
| **TEST Environment** | **Real** (Google's live developer environment; no real money moves) |
| **`cardFundingSource` / Address Fallback `(simulated)` Labels** | **Filled in by this project** (Only when Google's test payload omits a field) |
