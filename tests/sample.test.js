const { add } = require('./sample')
const { expect } = require('chai')

describe('sample', () => {
  it('# add', () => {
    expect(add(1, 2)).to.equal(3)
  })
})