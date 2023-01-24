import { describe, expect, test, jest } from '@jest/globals'
import hybrid from '../../utils/hybrid'
import openLink from '../../utils/openLink'

jest.mock('../../utils/hybrid.js', () => ({
  isNativeApp: jest.fn(),
  call: jest.fn(),
}))

const setUserAgent = (userAgent) => {
  jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementation(() => userAgent)
}

describe('opening a link in the app', () => {
  test('it calls a hybrid method', () => {
    hybrid.isNativeApp.mockImplementation(() => true)

    openLink('https://www.google.com/')

    expect(hybrid.call).toHaveBeenCalledWith('navigateTo', { inApp: false, url: 'https://www.google.com/' })
  })
})

describe('opening a link in the browser', () => {
  test('it opens in a new window in non-Safari', () => {
    hybrid.isNativeApp.mockImplementation(() => false)
    setUserAgent('Chrome')
    window.open = jest.fn()

    openLink('https://www.google.com/')

    expect(window.open).toHaveBeenCalledWith('https://www.google.com/')
  })

  test('it redirects to the link in Safari', () => {
    hybrid.isNativeApp.mockImplementation(() => false)
    setUserAgent('Safari')
    delete window.location // allows us to set and read the location object

    openLink('https://www.google.com/')

    expect(window.location).toBe('https://www.google.com/')
  })
})
