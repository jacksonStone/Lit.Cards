import { getParam, onPage } from '../url';

// Window href and search are populated in test-setup
describe('abstract/url', () => {
  it('can get page params', () => {
    expect(getParam('foo')).toBe('bar')
    expect(getParam('bar')).toBe('baz')
  })
  it('can get correct page', () => {
    expect(onPage('bar')).toBe(false)
    expect(onPage('foo'))
  })
})
