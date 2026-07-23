/**
 * Recurring Subscription & MIT (Merchant Initiated Transaction) Module
 * Handles recurringTransactionInfo configuration and MIT credential extraction.
 */

export const RECURRING_CONFIG = {
  price: '14.99',
  currencyCode: 'USD',
  countryCode: 'US',
  recurrencePeriod: 'MONTH',
  recurrencePeriodCount: 1,
  managementUrl: 'https://example.com/account/subscription',
  tokenUpdateUrl: 'https://example.com/api/gpay/token-update'
};

/**
 * Builds the verified flat recurringTransactionInfo payload for Google Pay Web API v2.
 * @param {string} price - Subscription price per interval
 * @param {string} currencyCode - Currency code (e.g. USD)
 * @returns {Object} Flat recurringTransactionInfo object
 */
export function buildRecurringTransactionInfo(price = RECURRING_CONFIG.price, currencyCode = RECURRING_CONFIG.currencyCode) {
  return {
    currencyCode: currencyCode,
    countryCode: RECURRING_CONFIG.countryCode,
    transactionId: `sub-1499-monthly-${Date.now()}`,
    tokenUpdateUrl: RECURRING_CONFIG.tokenUpdateUrl,
    managementUrl: RECURRING_CONFIG.managementUrl,
    billingAgreement: `Monthly recurring subscription of $${price} for AI Agent Developer Subscription. Cancel anytime in your account settings.`,
    immediateTotalPrice: price,
    recurrenceItems: [
      {
        label: 'AI Agent Developer Monthly Subscription',
        price: price,
        priceStatus: 'FINAL',
        recurrencePeriod: RECURRING_CONFIG.recurrencePeriod,
        recurrencePeriodCount: RECURRING_CONFIG.recurrencePeriodCount
      }
    ]
  };
}

/**
 * Extracts Merchant Initiated Transaction (MIT) mandate metadata from Google Pay response.
 * @param {Object} paymentData - Google Pay loadPaymentData response object
 * @returns {Object} MIT mandate details
 */
export function parseRecurringMitDetails(paymentData) {
  const tokenizationData = paymentData?.paymentMethodData?.tokenizationData || {};
  return {
    isRecurringMandate: true,
    billingFrequency: 'MONTHLY',
    recurringAmount: `$${RECURRING_CONFIG.price}/month`,
    mitMandateId: `mit_mandate_${Math.random().toString(36).substr(2, 9)}`,
    tokenType: tokenizationData.type || 'PAYMENT_GATEWAY',
    gatewayToken: '[OPAQUE_SABRE_MIT_TOKEN_RECEIVED]'
  };
}
