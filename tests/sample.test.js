const { add } = require('./sample')
const { expect } = require('chai')

describe('sample', () => {
  it('# add', () => {
    expect(add(1, 2)).to.equal(3)
  })
  it('# 參數包含非數字', () => {
    expect(() => { add('a', 'b') }).to.throw('參數必須為數字')
  })
}) 