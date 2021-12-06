import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import users from './users';
import chat from './chat';
import events from './events';
import places from './places';
import selectedPlace from './selectedPlace';

const reducer = combineReducers({
  auth,
  users,
  chat,
  events,
  places,
  selectedPlace
 });
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
