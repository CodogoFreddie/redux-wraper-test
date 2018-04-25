import * as R from 'ramda'

import consts from './consts'

const getCleanType = ({ type }) =>
  type.includes(' ') ? type.split(' ').slice(-1)[0] : type

const noop = x => x

const createGeneralReducer = (initialState = false) => {
  const updaters = {
    [consts.setStateAction]: (state, { path, value }) =>
      R.assocPath(path, value, state),

    [consts.setStateBulkAction]: (state, { mutations }) =>
      R.reduce(
        (state, { path, value }) => R.assocPath(path, value, state),
        state,
        mutations
      )
  }

  return {
    [consts.rootReducer]: (state = initialState, action) => {
      const updater = updaters[getCleanType(action)] || noop

      return updater(state, action)
    }
  }
}

export default createGeneralReducer
