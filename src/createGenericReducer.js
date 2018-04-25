import * as R from 'ramda'

const getCleanType = ({ type }) =>
  type.includes(' ') ? type.split(' ')[0] : type

const noop = x => x

const createGenericReducer = name => {
  const upperCaseName = name.toUpperCase()

  const updaters = {
    [`${upperCaseName}_SET_PROP`]: (state, { path, value }) =>
      R.assocPath(path, value, state),

    [`BULK_${upperCaseName}_SET_PROP`]: (state, { mutations }) =>
      R.reduce(
        (state, { path, value }) => R.assocPath(path, value, state),
        state,
        mutations
      )
  }

  return (state = {}, action) => {
    const updater = updaters[getCleanType(action)] || noop

    return updater(state, action)
  }
}

export default createGenericReducer
