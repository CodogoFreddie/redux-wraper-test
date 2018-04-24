import React, {Component, Fragment} from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider, connect} from 'react-redux';
import * as R from 'ramda';

function makeid() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const createGenericReducer = name => (state = {}, action) =>
  (({
    [`${name.toUpperCase()}_SET_PROP`]: (
      state,
      {path, value},
    ) => R.assocPath(path, value, state),
  }[action.type] || (x => x))(state, action));

const reducer = combineReducers({
  todos: createGenericReducer('todos'),
});

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const StateProvider = connect(x => x)(
  ({scope, children, dispatch, ...state}) => {
    const scopedState = R.path(scope, state);

    const mutator = ({path, value}) => {
      const [name, ...actionPath] = [...scope, ...path];

      dispatch({
        type: `${name.toUpperCase()}_SET_PROP`,
        path: actionPath,
        value,
      });
    };

    return <Fragment>{children(scopedState, mutator)}</Fragment>;
  },
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StateProvider scope={['todos']}>
          {(todos, mutateTodos) => (
            <div>
              {Object.keys(todos).map(id => (
                <StateProvider scope={['todos', id]}>
                  {(todo, mutateTodo) => (
                    <Fragment>
                      <input
                        value={todo.text}
                        onChange={e =>
                          mutateTodo({
                            path: ['text'],
                            value: e.target.value,
                          })
                        }
                      />
                      <div
                        style={{
                          height: 16,
                          width: 16,
                          backgroundColor: todo.done ? 'green' : 'red',
                        }}
                      />
                      <br />
                    </Fragment>
                  )}
                </StateProvider>
              ))}
              <button
                onClick={() =>
                  mutateTodos({
                    path: [makeid()],
                    value: {
                      text: 'foo',
                      done: false,
                    },
                  })
                }>
                New
              </button>
              <br />
              <button
                onClick={() =>
                  Object.keys(todos).forEach(id => {
                    mutateTodos({
                      path: [id, 'done'],
                      value: true,
                    });
                  })
                }>
                All Done
              </button>
            </div>
          )}
        </StateProvider>
      </Provider>
    );
  }
}

export default App;
