import { describe, expect, test, jest } from '@jest/globals'
import { removePhoneNumberCountryPrefix } from '../../index.js'

describe('removing explicitly given prefixes', () => {
  test('it removes the country prefix when there is a match', () => {
    const result = removePhoneNumberCountryPrefix('+31.634542211', '+31')

    expect(result).toBe('0634542211')
  })

  test('it does not remove the country prefix when there is no match, but it does remove the .', () => {
    const result = removePhoneNumberCountryPrefix('+33.634542211', '+31')

    expect(result).toBe('+33634542211')
  })

  test('it does not fail when the given number is null', () => {
    const result = removePhoneNumberCountryPrefix(null, '+31')

    expect(result).toBeNull()
  })
})

jest.mock('../../config/config.js', () => ({
  config: jest.fn(() => 'NL'),
}))

describe('removing prefixes provided by the config', () => {
  test('it removes the country prefix when there is a match', () => {
    const result = removePhoneNumberCountryPrefix('+31.634542211')

    expect(result).toBe('0634542211')
  })

  test('it does not remove the country prefix when there is no match, but it does remove the .', () => {
    const result = removePhoneNumberCountryPrefix('+32.634542211')

    expect(result).toBe('+32634542211')
  })
})
