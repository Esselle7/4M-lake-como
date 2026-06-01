import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CUSTOM_PACKAGE_ID,
  CUSTOM_PRICE_ADDON_ID,
  isCustomPackage,
  isCustomPriceAddon,
  discountRateForHours,
  addonsTotal,
  computeTotal,
  computePriceBreakdown,
  computeDeposit,
  selectedAddonLines,
} from './pricing.mjs'

const catalog = [
  { id: 'coca-cola', label: 'Coca-Cola', price: 5 },
  { id: 'spritz', label: 'Spritz', price: 15 },
  { id: 'gin-tonic', label: 'Gin Tonic', price: 15 },
  { id: 'champagne', label: 'Champagne', price: 90 },
]

test('isCustomPackage matches only the custom id', () => {
  assert.equal(isCustomPackage(CUSTOM_PACKAGE_ID), true)
  assert.equal(isCustomPackage('aperitivo'), false)
  assert.equal(isCustomPackage(''), false)
})

test('addonsTotal sums price × quantity over the catalog', () => {
  assert.equal(addonsTotal({ 'spritz': 2, 'coca-cola': 3 }, catalog), 2 * 15 + 3 * 5)
  assert.equal(addonsTotal({}, catalog), 0)
  assert.equal(addonsTotal(null, catalog), 0)
  // unknown ids are ignored
  assert.equal(addonsTotal({ 'unknown': 4 }, catalog), 0)
})

test('isCustomPriceAddon matches only the custom-priced extra', () => {
  assert.equal(isCustomPriceAddon(CUSTOM_PRICE_ADDON_ID), true)
  assert.equal(isCustomPriceAddon('spritz'), false)
})

test('discountRateForHours grows with duration, gently', () => {
  assert.equal(discountRateForHours(1), 0)
  assert.equal(discountRateForHours(1.5), 0.03)
  assert.equal(discountRateForHours(2), 0.05)
  assert.equal(discountRateForHours(2.5), 0.07)
  assert.equal(discountRateForHours(3), 0.1)
  assert.equal(discountRateForHours(4), 0.15)
  // monotonic: never decreases as hours grow
  let prev = 0
  for (const h of [1, 1.5, 2, 2.5, 3, 4]) {
    const r = discountRateForHours(h)
    assert.ok(r >= prev)
    prev = r
  }
})

test('custom package at 1h has no discount: hourly + extras', () => {
  const total = computeTotal({
    packageId: CUSTOM_PACKAGE_ID,
    unitPrice: 290,
    mode: 'private',
    guests: 2,
    durationHours: 1,
    addons: { 'spritz': 2, 'coca-cola': 1 },
    addonCatalog: catalog,
  })
  assert.equal(total, 290 + 15 * 2 + 5 * 1) // 290 + 35 = 325
})

test('custom package applies the hourly discount, extras stay full price', () => {
  const bd = computePriceBreakdown({
    packageId: CUSTOM_PACKAGE_ID,
    unitPrice: 290,
    mode: 'private',
    guests: 2,
    durationHours: 2,
    addons: { 'spritz': 2, 'coca-cola': 1 },
    addonCatalog: catalog,
  })
  assert.equal(bd.baseFull, 580)
  assert.equal(bd.discountRate, 0.05)
  assert.equal(bd.baseDiscounted, 551) // round(580 × 0.95)
  assert.equal(bd.addonsTotal, 35)
  assert.equal(bd.originalTotal, 615) // 580 + 35
  assert.equal(bd.total, 586) // 551 + 35
})

test('custom package: half-hour durations are supported (with discount)', () => {
  const bd = computePriceBreakdown({
    packageId: CUSTOM_PACKAGE_ID,
    unitPrice: 290,
    mode: 'private',
    guests: 4,
    durationHours: 1.5,
    addons: {},
    addonCatalog: catalog,
  })
  assert.equal(bd.baseFull, 435) // 290 × 1.5
  assert.equal(bd.total, Math.round(435 * 0.97)) // 3% off → 422
})

test('custom-priced extra (allestimento) adds nothing to the numeric total', () => {
  const withCustom = [...catalog, { id: CUSTOM_PRICE_ADDON_ID, label: 'Special setup', price: 0 }]
  const total = computeTotal({
    packageId: CUSTOM_PACKAGE_ID,
    unitPrice: 290,
    mode: 'private',
    guests: 2,
    durationHours: 1,
    addons: { [CUSTOM_PRICE_ADDON_ID]: 1, 'spritz': 1 },
    addonCatalog: withCustom,
  })
  assert.equal(total, 290 + 15) // setup contributes 0
})

test('custom package ignores guests/mode (always whole boat)', () => {
  const a = computeTotal({ packageId: CUSTOM_PACKAGE_ID, unitPrice: 290, mode: 'private', guests: 1, durationHours: 1, addonCatalog: catalog })
  const b = computeTotal({ packageId: CUSTOM_PACKAGE_ID, unitPrice: 290, mode: 'shared', guests: 6, durationHours: 1, addonCatalog: catalog })
  assert.equal(a, 290)
  assert.equal(b, 290)
})

test('standard private package = unit price (whole boat)', () => {
  const total = computeTotal({ packageId: 'aperitivo', unitPrice: 350, mode: 'private', guests: 4, durationHours: 0 })
  assert.equal(total, 350)
})

test('standard shared package = unit price × guests', () => {
  const total = computeTotal({ packageId: 'aperitivo', unitPrice: 350, mode: 'shared', guests: 3, durationHours: 0 })
  assert.equal(total, 1050)
})

test('shared package defaults to 1 guest when guests missing', () => {
  const total = computeTotal({ packageId: 'aperitivo', unitPrice: 350, mode: 'shared', guests: 0, durationHours: 0 })
  assert.equal(total, 350)
})

test('computeDeposit is 30% rounded to nearest euro', () => {
  assert.equal(computeDeposit(615), 185) // 184.5 → 185
  assert.equal(computeDeposit(350), 105)
  assert.equal(computeDeposit(290), 87)
  assert.equal(computeDeposit(0), 0)
})

test('selectedAddonLines returns only chosen extras in catalog order', () => {
  const lines = selectedAddonLines({ 'gin-tonic': 2, 'coca-cola': 1 }, catalog)
  assert.deepEqual(lines, [
    { id: 'coca-cola', label: 'Coca-Cola', price: 5, qty: 1, lineTotal: 5 },
    { id: 'gin-tonic', label: 'Gin Tonic', price: 15, qty: 2, lineTotal: 30 },
  ])
  assert.deepEqual(selectedAddonLines({}, catalog), [])
})
