import React from 'react'

import createGeneralReducer from '../createGeneralReducer'
import consts from '../consts'

describe('createGeneralReducer', () => {
  const initialState = {
    foo: {
      bar: true
    },
    other: 'abc'
  }

  let reducer

  beforeEach(() => {
    reducer = createGeneralReducer(initialState)
  })

  it('creates an object with the correct property name', () => {
    expect(reducer[consts.rootReducer]).toBeTruthy()
  })

  it('creates a reducer', () => {
    const state = {}
    const result = reducer[consts.rootReducer](state, { type: '' })

    expect(result).toBe(state)
  })

  it('creates a reducer with the correct initial state', () => {
    const state = {
      foo: {
        bar: {
          baz: true
        }
      }
    }

    reducer = createGeneralReducer(state)

    const result = reducer[consts.rootReducer](undefined, { type: '' })

    expect(result).toBe(state)
  })

  describe(consts.setStateAction, () => {
    it('updates a part of its state', () => {
      const action = {
        type: consts.setStateAction,
        path: ['foo'],
        value: 'newValue'
      }

      const result = reducer[consts.rootReducer](undefined, action)

      expect(result).toEqual({
        foo: 'newValue',
        other: 'abc'
      })
    })

    it('updates a deep path of its state', () => {
      const action = {
        type: consts.setStateAction,
        path: ['foo', 'bar'],
        value: 'newValue'
      }

      const result = reducer[consts.rootReducer](undefined, action)

      expect(result).toEqual({
        foo: {
          bar: 'newValue'
        },
        other: 'abc'
      })
    })

    it('creates a path in the state if it does not exist', () => {
      const action = {
        type: consts.setStateAction,
        path: ['foo', 'bar', 'qux'],
        value: 'newValue'
      }

      const result = reducer[consts.rootReducer](undefined, action)

      expect(result).toEqual({
        foo: {
          bar: {
            qux: 'newValue'
          }
        },
        other: 'abc'
      })
    })

    it('can modify a value in an array', () => {
      const state = {
        foo: [1, 2, 3],
        other: 'abc'
      }

      const action = {
        type: consts.setStateAction,
        path: ['foo', 1],
        value: 'newValue'
      }

      const result = reducer[consts.rootReducer](state, action)

      expect(result).toEqual({
        foo: [1, 'newValue', 3],
        other: 'abc'
      })
    })
  })
  describe(consts.setStateBulkAction, () => {
    it('updates many parts of its state', () => {
      const action = {
        type: consts.setStateBulkAction,
        mutations: [
          {
            path: ['foo'],
            value: 'newValue'
          },
          {
            path: ['other'],
            value: 'def'
          }
        ]
      }

      const result = reducer[consts.rootReducer](undefined, action)

      expect(result).toEqual({
        foo: 'newValue',
        other: 'def'
      })
    })

    it('updates many deep paths of its state', () => {
      const action = {
        type: consts.setStateBulkAction,
        mutations: [
          {
            path: ['foo', 'bar'],
            value: 'newValue'
          },
          {
            path: ['other'],
            value: 'def'
          }
        ]
      }

      const result = reducer[consts.rootReducer](undefined, action)

      expect(result).toEqual({
        foo: { bar: 'newValue' },
        other: 'def'
      })
    })

    it('creates many paths in the state if they do not exist', () => {
      const action = {
        type: consts.setStateBulkAction,
        mutations: [
          {
            path: ['foo', 'bar', 'qux'],
            value: 'newValue'
          },
          {
            path: ['other'],
            value: 'def'
          }
        ]
      }

      const result = reducer[consts.rootReducer](undefined, action)

      expect(result).toEqual({
        foo: { bar: { qux: 'newValue' } },
        other: 'def'
      })
    })

    it('can modify many values in arrays', () => {
      const state = {
        foo: [1, 2, 3],
        other: ['a', 'b', 'c']
      }

      const action = {
        type: consts.setStateBulkAction,
        mutations: [
          {
            path: ['foo', 1],
            value: 'newValue'
          },
          {
            path: ['other', 1],
            value: 'otherNewValue'
          }
        ]
      }

      const result = reducer[consts.rootReducer](state, action)

      expect(result).toEqual({
        foo: [1, 'newValue', 3],
        other: ['a', 'otherNewValue', 'c']
      })
    })
  })
})
