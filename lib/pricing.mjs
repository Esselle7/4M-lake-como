// @ts-check
// Pure booking-price logic, shared by the UI and covered by lib/pricing.test.mjs.
// Kept framework-free so it can run under `node --test` without a build step.

/** Id of the fully customizable, private-only package ("La Bella Vita"). */
export const CUSTOM_PACKAGE_ID = 'la-bella-vita'

/** Id of the extra with no fixed price (quoted later) — requires a description. */
export const CUSTOM_PRICE_ADDON_ID = 'allestimento'

/** Deposit share of the total price (30%). */
export const DEPOSIT_RATE = 0.3

/**
 * @typedef {Object} Addon
 * @property {string} id
 * @property {string} label
 * @property {number} price
 */

/**
 * @param {string} packageId
 * @returns {boolean} true when the package is the customizable, private-only one.
 */
export function isCustomPackage(packageId) {
  return packageId === CUSTOM_PACKAGE_ID
}

/**
 * @param {string} addonId
 * @returns {boolean} true for the custom-priced extra (no fixed price, quoted later).
 */
export function isCustomPriceAddon(addonId) {
  return addonId === CUSTOM_PRICE_ADDON_ID
}

/**
 * Progressive, gentle discount on the hourly subtotal of the custom package:
 * the longer the booking, the bigger the saving (incentive to book more hours).
 * Applies only to the time, never to the extras.
 * @param {number} hours
 * @returns {number} discount rate in [0, 1]
 */
export function discountRateForHours(hours) {
  const h = Number(hours) || 0
  if (h >= 4) return 0.15
  if (h >= 3) return 0.1
  if (h >= 2.5) return 0.07
  if (h >= 2) return 0.05
  if (h >= 1.5) return 0.03
  return 0
}

/**
 * Sum of the selected onboard extras (unit price × quantity).
 * @param {Record<string, number> | undefined | null} addons map addonId → quantity
 * @param {readonly Addon[]} catalog
 * @returns {number}
 */
export function addonsTotal(addons, catalog) {
  if (!addons || !catalog) return 0
  return catalog.reduce((sum, a) => sum + a.price * (addons[a.id] || 0), 0)
}

/**
 * @typedef {Object} PriceBreakdown
 * @property {number} baseFull        time/boat subtotal before any discount
 * @property {number} baseDiscounted  time/boat subtotal after the hourly discount
 * @property {number} discountRate    applied discount rate in [0, 1]
 * @property {number} addonsTotal     extras subtotal (never discounted)
 * @property {number} originalTotal   what it would cost without the discount
 * @property {number} total           amount actually due
 */

/**
 * Full price breakdown for a booking.
 *  - custom package → (hourly × hours) discounted by {@link discountRateForHours} + extras
 *  - shared mode    → unit price × guests (per person) + extras
 *  - private mode   → unit price (whole boat) + extras
 *
 * @param {Object} args
 * @param {string} args.packageId
 * @param {number} args.unitPrice base price (per-hour for the custom package)
 * @param {'private'|'shared'} args.mode
 * @param {number} args.guests
 * @param {number} args.durationHours
 * @param {Record<string, number>} [args.addons]
 * @param {readonly Addon[]} [args.addonCatalog]
 * @returns {PriceBreakdown}
 */
export function computePriceBreakdown({
  packageId,
  unitPrice,
  mode,
  guests,
  durationHours,
  addons = {},
  addonCatalog = [],
}) {
  const base = Number(unitPrice) || 0
  const extras = addonsTotal(addons, addonCatalog)

  if (isCustomPackage(packageId)) {
    const hours = Number(durationHours) || 0
    const baseFull = base * hours
    const discountRate = discountRateForHours(hours)
    const baseDiscounted = Math.round(baseFull * (1 - discountRate))
    return {
      baseFull,
      baseDiscounted,
      discountRate,
      addonsTotal: extras,
      originalTotal: baseFull + extras,
      total: baseDiscounted + extras,
    }
  }

  const subtotal = mode === 'shared' ? base * (Number(guests) || 1) : base
  return {
    baseFull: subtotal,
    baseDiscounted: subtotal,
    discountRate: 0,
    addonsTotal: extras,
    originalTotal: subtotal + extras,
    total: subtotal + extras,
  }
}

/**
 * Convenience wrapper returning just the amount due. See {@link computePriceBreakdown}.
 * @param {Parameters<typeof computePriceBreakdown>[0]} args
 * @returns {number}
 */
export function computeTotal(args) {
  return computePriceBreakdown(args).total
}

/**
 * Deposit due to confirm the booking: 30% of the total, rounded to the nearest euro.
 * @param {number} total
 * @returns {number}
 */
export function computeDeposit(total) {
  return Math.round((Number(total) || 0) * DEPOSIT_RATE)
}

/**
 * Expands a quantity map into the line items that are actually selected (qty > 0),
 * preserving catalog order. Useful for receipts / summaries.
 * @param {Record<string, number> | undefined | null} addons
 * @param {readonly Addon[]} catalog
 * @returns {Array<{ id: string, label: string, price: number, qty: number, lineTotal: number }>}
 */
export function selectedAddonLines(addons, catalog) {
  if (!addons || !catalog) return []
  return catalog
    .filter((a) => (addons[a.id] || 0) > 0)
    .map((a) => {
      const qty = addons[a.id]
      return { id: a.id, label: a.label, price: a.price, qty, lineTotal: a.price * qty }
    })
}
