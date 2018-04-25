import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

import consts from './consts'

const generateSingleAction = ({ scope, path = [], value }) => {
  const actionPath = [...scope, ...path]

  return {
    type: consts.setStateAction,
    path: actionPath,
    value
  }
}

const generateMultiAction = ({ scope, mutations }) => {
  return {
    type: consts.setStateBulkAction,
    mutations: mutations.map(({ path, value }) => {
      const actionPath = [...scope, ...path].slice(1)
      return {
        path: actionPath,
        value
      }
    })
  }
}

const addLabelToType = (label = '') =>
  R.evolve({
    type: x => (label.length ? `${x}::${label}` : x)
  })

@connect(R.prop(consts.rootReducer))
class StateProvider extends React.Component {
  render() {
    const { scope, children, dispatch, ...state } = this.props
    const scopedState = R.path(scope, state)

    const setState = (input, label = '') => {
      const newState = typeof input === 'function' ? input(scopedState) : input

      const action = generateSingleAction({
        scope,
        path: [],
        value: newState
      })

      dispatch(addLabelToType(label)(action))
    }

    const constructAction = (input, label = '') => {
      const mutations = typeof input === 'function' ? input(scopedState) : input

      const action = Array.isArray(mutations)
        ? generateMultiAction({ scope, mutations: mutations })
        : generateSingleAction({ scope, ...mutations })

      dispatch(addLabelToType(label)(action))
    }

    return children(scopedState, setState, constructAction)
  }
}

export default StateProvider
