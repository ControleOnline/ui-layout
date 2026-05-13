const {describe, expect, it} = global

const {
  DEFAULT_BOTTOM_NAVIGATION_HEIGHT,
  MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT,
  getBottomNavigationBaseHeight,
  getBottomNavigationOffset,
  shouldShowOperationalBottomNavigation,
} = require('../../../react/utils/posBottomNavigation')

describe('posBottomNavigation', () => {
  it('keeps the operational dock visible for POS cashier, waiter and counter flows', () => {
    expect(
      shouldShowOperationalBottomNavigation({
        appType: 'POS',
        interactionMode: 'pdv',
        isKioskMode: false,
      }),
    ).toBe(true)

    expect(
      shouldShowOperationalBottomNavigation({
        appType: 'POS',
        interactionMode: 'waiter',
        isKioskMode: false,
      }),
    ).toBe(true)
  })

  it('also keeps the dock when the manager hosts the PDV flow', () => {
    expect(
      shouldShowOperationalBottomNavigation({
        appType: 'MANAGER',
        interactionMode: 'pdv',
        isKioskMode: false,
      }),
    ).toBe(true)
  })

  it('hides the operational dock in kiosk mode or non-pdv manager flows', () => {
    expect(
      shouldShowOperationalBottomNavigation({
        appType: 'POS',
        interactionMode: 'pdv',
        isKioskMode: true,
      }),
    ).toBe(false)

    expect(
      shouldShowOperationalBottomNavigation({
        appType: 'MANAGER',
        interactionMode: 'manager',
        isKioskMode: false,
      }),
    ).toBe(false)
  })

  it('uses the modern dock height only for manager and ppc shells', () => {
    expect(getBottomNavigationBaseHeight('POS')).toBe(
      DEFAULT_BOTTOM_NAVIGATION_HEIGHT,
    )
    expect(getBottomNavigationBaseHeight('MANAGER')).toBe(
      MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT,
    )
    expect(getBottomNavigationBaseHeight('PPC')).toBe(
      MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT,
    )
  })

  it('keeps a minimum bottom inset when offsetting floating bars', () => {
    expect(getBottomNavigationOffset({appType: 'POS', bottomInset: 0})).toBe(
      DEFAULT_BOTTOM_NAVIGATION_HEIGHT + 8,
    )
    expect(
      getBottomNavigationOffset({appType: 'MANAGER', bottomInset: 24}),
    ).toBe(MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT + 24)
  })
})
