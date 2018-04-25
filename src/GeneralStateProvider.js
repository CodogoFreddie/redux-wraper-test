import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

const recursiveProxyGenerator = (mutations, state = {}, path = []) =>
  new Proxy(state, {
    get: (target, prop) => {
      if (
        typeof target[prop] === 'object' ||
        typeof target[prop] === 'undefined'
      ) {
        return recursiveProxyGenerator(mutations, target[prop], [...path, prop])
      } else {
        return target[prop]
      }
    },
    set: (target, prop, value) => {
      mutations.push({
        path: [...path, prop],
        value
      })
      return true
    }
  })

const createActionProducingProxy = state => {
  const mutations = []

  const proxy = recursiveProxyGenerator(mutations, state)

  return { proxy, mutations }
}

const generateSingleAction = ({ scope, path, value }) => {
  const [name, ...actionPath] = [...scope, ...path]

  return {
    type: `${name.toUpperCase()}_SET_PROP`,
    path: actionPath,
    value
  }
}

const generateMultiAction = ({ scope, mutations }) => {
  const [name] = scope

  return {
    type: `${name.toUpperCase()}_SET_PROP_BULK`,
    mutations: mutations.map(({ path, value }) => {
      const actionPath = [...scope, ...path].slice(1)
      return {
        path: actionPath,
        value
      }
    })
  }
}

@connect(x => x)
class StateProvider extends React.Component {
  render() {
    const { scope, children, dispatch, ...state } = this.props
    const scopedState = R.path(scope, state)

    const mutator = (input, label) => {
      let action

      if (typeof input === 'function') {
        const { proxy, mutations } = createActionProducingProxy(scopedState)

        input(proxy)

        if (mutations.length === 0) {
          return
        } else if (mutations.length === 1) {
          action = generateSingleAction({
            scope,
            ...mutations[0]
          })
        } else {
          action = generateMultiAction({
            scope,
            mutations
          })
        }
      } else if (Array.isArray(input)) {
        action = generateMultiAction({
          scope,
          mutations: input
        })
      } else {
        const { path, value } = input

        action = generateSingleAction({
          scope,
          path,
          value
        })
      }

      if (label) {
        action.type = `(${label}) ${action.type}`
      }

      dispatch(action)
    }

    return children(scopedState, mutator)
  }
}

export default StateProvider
