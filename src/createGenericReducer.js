import * as R from 'ramda'

const createGenericReducer = name => {
  const labelMatchString = '(\\([a-z ]+\\) )?'
  const upperCaseName = name.toUpperCase()

  const setMatcher = new RegExp(
    `^${labelMatchString}${upperCaseName}_SET_PROP$`
  )
  const bulkSetMatcher = new RegExp(
    `^${labelMatchString}BULK_${upperCaseName}_SET_PROP$`
  )

  return (state = {}, action) => {
    if (!action.type.includes(upperCaseName)) {
      return state
    }

    if (setMatcher.test(action.type)) {
      const { path, value } = action
      return R.assocPath(path, value, state)
    }

    if (bulkSetMatcher.test(action.type)) {
      const { mutations } = action
      return R.reduce(
        (state, { path, value }) => R.assocPath(path, value, state),
        state,
        mutations
      )
    }

    return state
  }
}

export default createGenericReducer
