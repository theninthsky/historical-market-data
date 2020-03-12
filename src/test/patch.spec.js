require('../util/patch')

describe('Monkey Patching', () => {
  it("should add a 'capitalize' method to string objects", () => {
    expect('hello'.capitalize()).toBe('Hello')
  })
})
