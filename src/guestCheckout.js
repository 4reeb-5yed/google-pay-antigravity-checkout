/**
 * Express Guest Checkout & Data Collection Module
 * Handles product attribute validation, guest card payment parameters,
 * and contact/address data extraction from Google Pay API responses.
 */

import { getBaseCardPaymentMethod, GPAY_CONFIG } from './config.js';

/**
 * Validates that required product attributes (Size and Color) are selected.
 * @param {Object} selectedAttributes - { size, color }
 * @returns {Object} { isValid, missingAttributes }
 */
export function validateProductAttributes(selectedAttributes = {}) {
  const missing = [];
  if (!selectedAttributes.size) missing.push('Size');
  if (!selectedAttributes.color) missing.push('Color');

  return {
    isValid: missing.length === 0,
    missingAttributes: missing,
    summary: missing.length === 0 ? `${selectedAttributes.color}, Size ${selectedAttributes.size}` : ''
  };
}

/**
 * Returns card payment method extended with FULL billing address and phone number requirements.
 * @returns {Object} CardPaymentMethod with billingAddressParameters
 */
export function getGuestCardPaymentMethod() {
  const baseCard = getBaseCardPaymentMethod();
  return Object.assign({}, baseCard, {
    tokenizationSpecification: GPAY_CONFIG.tokenizationSpecification,
    parameters: Object.assign({}, baseCard.parameters, {
      billingAddressRequired: true,
      billingAddressParameters: {
        format: 'FULL',
        phoneNumberRequired: true
      }
    })
  });
}

/**
 * Extracts and formats email, shipping address, phone number, and billing address from Google Pay response.
 * @param {Object} paymentData - Google Pay loadPaymentData response payload
 * @returns {Object} Guest contact & address details
 */
export function parseGuestContactData(paymentData) {
  const email = paymentData?.email || 'guest.developer@example.com';
  const shipping = paymentData?.shippingAddress || {};
  const paymentMethodData = paymentData?.paymentMethodData || {};
  const billing = paymentMethodData.info?.billingAddress || {};

  const formattedShipping = {
    name: shipping.name || 'John Doe (Guest)',
    address1: shipping.address1 || '123 Innovation Way',
    address2: shipping.address2 || 'Suite 400',
    locality: shipping.locality || 'San Francisco',
    administrativeArea: shipping.administrativeArea || 'CA',
    postalCode: shipping.postalCode || '94105',
    countryCode: shipping.countryCode || 'US',
    phoneNumber: shipping.phoneNumber || '+1 (555) 019-2834'
  };

  const formattedBilling = {
    name: billing.name || formattedShipping.name,
    address1: billing.address1 || formattedShipping.address1,
    locality: billing.locality || formattedShipping.locality,
    administrativeArea: billing.administrativeArea || formattedShipping.administrativeArea,
    postalCode: billing.postalCode || formattedShipping.postalCode,
    countryCode: billing.countryCode || formattedShipping.countryCode,
    phoneNumber: billing.phoneNumber || formattedShipping.phoneNumber
  };

  return {
    email,
    shippingAddress: formattedShipping,
    billingAddress: formattedBilling,
    displayShippingString: `${formattedShipping.address1}, ${formattedShipping.locality}, ${formattedShipping.administrativeArea} ${formattedShipping.postalCode}`,
    displayBillingString: `${formattedBilling.address1}, ${formattedBilling.locality}, ${formattedBilling.administrativeArea} ${formattedBilling.postalCode}`
  };
}
