# MCP Interaction Log & Observations

## MCP Documentation Search Quirk (Google Pay Auth Methods)

- **Date / Context**: Verification of `search_documentation` tool output for the Google Pay checkout button spec.
- **Observation**:
  - The MCP response from `search_documentation` included example code snippets containing `allowedAuthMethods: ['PANONLY', 'CRYPTOGRAM3DS']` (without underscores).
  - The official Google Pay Web API v2 standard requires **`PAN_ONLY`** and **`CRYPTOGRAM_3DS`** (with underscores).
- **Verification**:
  - Verified that [`src/config.js`](file:///e:/google-pay-antigravity-checkout/src/config.js) already uses the correct, official underscored values (`PAN_ONLY` / `CRYPTOGRAM_3DS`).
- **Key Takeaway & Guidance**:
  - Flagged as a known MCP response quirk. Example code snippets within MCP returned documentation should be cross-verified against official specifications rather than blindly applied verbatim.

## Card Funding Source Signal & Fallback Handling

- **Date / Context**: Implementation of dynamic card funding source surcharge engine and `src/pricing.js` refactoring.
- **Observation**:
  - In certain test environments or mock Google Pay test sheet payloads, `paymentMethodData.info.cardFundingSource` may be omitted or undefined.
- **Implementation**:
  - Extracted parsing and surcharge logic into dedicated [`src/pricing.js`](file:///e:/google-pay-antigravity-checkout/src/pricing.js) module.
  - Implemented `parseCardFundingSource()`:
    - If `cardFundingSource` is missing/undefined, emits a visible `console.warn` log.
    - Sets `isSimulated: true` and defaults fallback to `'CREDIT'`.
## RecurringTransactionInfo Schema Lookup & Grounding Note

- **Date / Context**: Verification of `RecurringTransactionInfo` structure for Google Pay API v2.
- **Observation**:
  - `search_documentation` for `RecurringTransactionInfo` and specific sub-fields (`managementUrl`, `recurrencePeriod`, `tokenUpdateUrl`, etc.) returned empty results (`{}`).
- **Resolution & Grounding**:
  - The precise `RecurringTransactionInfo` schema (flat structure, `immediateTotalPrice`, `recurrenceItems` array with `label`, `price`, `priceStatus: 'FINAL'`, `recurrencePeriod: 'MONTH'`, `recurrencePeriodCount: 1`, `tokenUpdateUrl`, `managementUrl`, `billingAgreement`, and mutual exclusivity with `transactionInfo`) was sourced from verified Google Pay API reference specifications rather than claiming fresh MCP retrieval.


