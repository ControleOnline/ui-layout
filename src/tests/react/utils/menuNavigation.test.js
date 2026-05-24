const {describe, expect, it} = global

const {
  resolveMenuRouteName,
  resolveMenuRouteParams,
} = require('../../../react/utils/menuNavigation')

describe('menuNavigation', () => {
  it('maps legacy display routes to the current React route names', () => {
    expect(resolveMenuRouteName('displayList')).toBe('DisplayList')
    expect(resolveMenuRouteName('displayDetails')).toBe('DisplayDetails')
  })

  it('keeps current route names untouched', () => {
    expect(resolveMenuRouteName('DisplayList')).toBe('DisplayList')
    expect(resolveMenuRouteName('OrderHistoryPage')).toBe('OrderHistoryPage')
  })

  it('normalizes invalid menu params to an empty object', () => {
    expect(resolveMenuRouteParams()).toEqual({})
    expect(resolveMenuRouteParams([])).toEqual({})
    expect(resolveMenuRouteParams('foo')).toEqual({})
  })

  it('preserves object params for menu navigation', () => {
    expect(resolveMenuRouteParams({id: 10})).toEqual({id: 10})
  })
})
