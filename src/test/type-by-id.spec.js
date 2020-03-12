const typeByID = require('../lib/type-by-id')

describe('Instrument Type', () => {
  it('should return the instrument type for a given ID', () => {
    expect(typeByID('eurusd')).toBe('forex')
    expect(typeByID('aaplususd')).toBe('stocks')
    expect(typeByID('diaususd')).toBe('ETF')
    expect(typeByID('btcusd')).toBe('crypto')
    expect(typeByID('unmapped')).toBe('stocks')
  })
})
