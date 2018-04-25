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
  ...createGeneralReducer({ todos: { foo: { done: true, text: 'boi' } } })
})

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const Todo = ({ id }) => (
  <GeneralStateProvider scope={['todos', id]}>
    {(todo, setState, generateAction) => (
      <Fragment>
        <input
          value={todo.text}
          onChange={e =>
            generateAction({
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
            generateAction(
              ({ done }) => ({
                path: ['done'],
                value: !done
              }),
              'toggle todo and update text'
            )
          }
        />
        <div
          style={{
            height: 32,
            width: 32,
            backgroundColor: 'blue'
          }}
          onClick={() => {}}
        />
        <br />
      </Fragment>
    )}
  </GeneralStateProvider>
)

const Todos = () => (
  <GeneralStateProvider scope={['todos']}>
    {(todos, setState, constructAction) => (
      <div>
        <button
          onClick={() =>
            constructAction(
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
            constructAction(
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
