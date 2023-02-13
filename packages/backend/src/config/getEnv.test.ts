import { describe, expect, it } from 'vitest'

import { getEnv } from './getEnv'

describe(getEnv.name, () => {
  it('returns the environment variable', () => {
    process.env.TEST_A = 'foo'
    const result = getEnv('TEST_A')
    expect(result).toEqual('foo')
  })

  it('returns the fallback if the variable is not present', () => {
    delete process.env.TEST_A
    const result = getEnv('TEST_A', 'bar')
    expect(result).toEqual('bar')
  })

  it('throws if variable is not present and there is no fallback', () => {
    delete process.env.TEST_A
    expect(() => getEnv('TEST_A')).toThrow()
  })

  describe(getEnv.integer.name, () => {
    it('returns the environment variable as integer', () => {
      process.env.TEST_A = '-420'
      const result = getEnv.integer('TEST_A')
      expect(result).toEqual(-420)
    })

    it('returns the fallback if the variable is not present', () => {
      delete process.env.TEST_A
      const result = getEnv.integer('TEST_A', 69)
      expect(result).toEqual(69)
    })

    it('throws if variable is not present and there is no fallback', () => {
      delete process.env.TEST_A
      expect(() => getEnv.integer('TEST_A')).toThrow()
    })

    it('throws if variable is not an integer', () => {
      process.env.TEST_A = 'foo'
      expect(() => getEnv.integer('TEST_A')).toThrow()
    })
  })

  describe(getEnv.boolean.name, () => {
    it('returns the environment variable as boolean', () => {
      process.env.TEST_B = 'FALSE'
      const result = getEnv.boolean('TEST_B')
      expect(result).toEqual(false)
    })

    it('returns the fallback if the variable is not present', () => {
      delete process.env.TEST_B
      const result = getEnv.boolean('TEST_B', false)
      expect(result).toEqual(false)
    })

    it('throws if variable is not present and there is no fallback', () => {
      delete process.env.TEST_B
      expect(() => getEnv.boolean('TEST_B')).toThrow()
    })

    it('throws if variable is not a boolean', () => {
      process.env.TEST_B = '69'
      expect(() => getEnv.boolean('TEST_B')).toThrow()
    })
  })
})
