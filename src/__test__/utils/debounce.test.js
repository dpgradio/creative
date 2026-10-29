import { describe, expect, test, jest } from '@jest/globals'
import debounce from '../../utils/debounce.js'

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('it calls the function after the delay', () => {
    const fn = jest.fn()
    const debounced = debounce(100, fn)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('it resets the timer on subsequent calls', () => {
    const fn = jest.fn()
    const debounced = debounce(100, fn)

    debounced()
    jest.advanceTimersByTime(50)
    debounced()
    jest.advanceTimersByTime(50)

    expect(fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('it passes arguments to the function', () => {
    const fn = jest.fn()
    const debounced = debounce(100, fn)

    debounced('hello', 42)
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('hello', 42)
  })

  test('it uses the arguments from the last call', () => {
    const fn = jest.fn()
    const debounced = debounce(100, fn)

    debounced('first')
    debounced('second')
    jest.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('second')
  })
})
