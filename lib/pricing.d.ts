// Type declarations for the framework-free pricing module (pricing.mjs).
// The runtime implementation lives in pricing.mjs so it can run under `node --test`.

export const CUSTOM_PACKAGE_ID: 'la-bella-vita'
export const CUSTOM_PRICE_ADDON_ID: 'allestimento'
export const DEPOSIT_RATE: number

export interface Addon {
  id: string
  label: string
  price: number
}

export interface PriceBreakdown {
  baseFull: number
  baseDiscounted: number
  discountRate: number
  addonsTotal: number
  originalTotal: number
  total: number
}

export interface AddonLine {
  id: string
  label: string
  price: number
  qty: number
  lineTotal: number
}

export interface ComputeTotalArgs {
  packageId: string
  unitPrice: number
  mode: 'private' | 'shared'
  guests: number
  durationHours: number
  addons?: Record<string, number>
  addonCatalog?: readonly Addon[]
}

export function isCustomPackage(packageId: string): boolean
export function isCustomPriceAddon(addonId: string): boolean
export function discountRateForHours(hours: number): number
export function addonsTotal(addons: Record<string, number> | undefined | null, catalog: readonly Addon[]): number
export function computePriceBreakdown(args: ComputeTotalArgs): PriceBreakdown
export function computeTotal(args: ComputeTotalArgs): number
export function computeDeposit(total: number): number
export function selectedAddonLines(
  addons: Record<string, number> | undefined | null,
  catalog: readonly Addon[],
): AddonLine[]
