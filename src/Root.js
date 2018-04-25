import React, { Component, Fragment } from 'react'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import createGeneralReducer from './createGeneralReducer'
import GeneralStateProvider from './GeneralStateProvider'

const makeid = () => {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const reducer = combineReducers({
  ...createGeneralReducer('todos')
})

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const Todo = ({ id }) => (
  <GeneralStateProvider scope={['todos', id]}>
    {(todo, mutateTodo) => (
      <Fragment>
        <input
          value={todo.text}
          onChange={e =>
            mutateTodo({
              path: ['text'],
              value: e.target.value
            })
          }
        />
        <div
          style={{
            height: 32,
            width: 32,
            backgroundColor: todo.done ? 'green' : 'red'
          }}
          onClick={() =>
            mutateTodo(draft => {
              const newDoneValue = !draft.done
              draft.done = newDoneValue
              if (newDoneValue) {
                draft.text = draft.text + ' (done)'
              } else {
                draft.text = draft.text.replace(' (done)', '')
              }
            }, 'toggle todo and update text')
          }
        />
        <div
          style={{
            height: 32,
            width: 32,
            backgroundColor: 'blue'
          }}
          onClick={() =>
            mutateTodo(draft => {
              draft.deeply.nested.boi = true
            })
          }
        />
        <br />
      </Fragment>
    )}
  </GeneralStateProvider>
)

const Todos = () => (
  <GeneralStateProvider scope={['todos']}>
    {(todos, mutateTodos) => (
      <div>
        <button
          onClick={() =>
            mutateTodos(
              {
                path: [makeid()],
                value: {
                  text: 'foo',
                  done: false
                }
              },
              'make new todo'
            )
          }>
          New
        </button>
        <br />
        <button
          onClick={() =>
            mutateTodos(
              Object.keys(todos).map(id => ({
                path: [id, 'done'],
                value: true
              })),
              'set all to done'
            )
          }>
          All Done
        </button>
        <br />
        {Object.keys(todos).map(id => <Todo key={id} id={id} />)}
      </div>
    )}
  </GeneralStateProvider>
)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Todos />
      </Provider>
    )
  }
}

export default App
