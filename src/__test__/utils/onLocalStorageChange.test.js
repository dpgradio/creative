import { describe, expect, test } from '@jest/globals'
import { onLocalStorageChange } from '../../utils/onLocalStorageChange.js'

describe('removing explicitly given prefixes', () => {
  test('it returns the current value when immediate is set to true', () => {
    localStorage.setItem('country_code', 'NL')

    let result

    onLocalStorageChange('country_code', (value) => (result = value), true)

    expect(result).toBe('NL')
  })

  test('it watches for new values', async () => {
    let result

    onLocalStorageChange('country_code', (value) => (result = value))

    // A local storage event is only fired when a change is made from another tab
    // so, we fake it here
    window.dispatchEvent(Object.assign(new Event('storage'), { key: 'country_code', newValue: 'BE' }))

    expect(result).toBe('BE')
  })

  test('it watches replaces the current value with new values when immediate is true', () => {
    localStorage.setItem('country_code', 'NL')

    let result

    onLocalStorageChange('country_code', (value) => (result = value), true)

    window.dispatchEvent(Object.assign(new Event('storage'), { key: 'country_code', newValue: 'BE' }))

    expect(result).toBe('BE')
  })
})
