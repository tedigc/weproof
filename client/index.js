// react/redux
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// custom
import routes from './routes';

injectTapEventPlugin();

const store = createStore(
  (state = {}) => state,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
  <MuiThemeProvider>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);