import * as R from 'ramda'

const getCleanType = ({ type }) =>
  type.includes(' ') ? type.split(' ').slice(-1)[0] : type

const noop = x => x

const createGeneralReducer = name => {
  const upperCaseName = name.toUpperCase()

  const updaters = {
    [`${upperCaseName}_SET_PROP`]: (state, { path, value }) =>
      R.assocPath(path, value, state),

    [`${upperCaseName}_SET_PROP_BULK`]: (state, { mutations }) =>
      R.reduce(
        (state, { path, value }) => R.assocPath(path, value, state),
        state,
        mutations
      )
  }

  return {
    [name]: (state = {}, action) => {
      const updater = updaters[getCleanType(action)] || noop

      return updater(state, action)
    }
  }
}

export default createGeneralReducer
