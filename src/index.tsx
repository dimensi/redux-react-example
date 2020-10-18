import React from 'react';
import {render} from 'react-dom';
import App from './App';
import {Router} from 'react-router-dom';
import {routerHistory} from './history';
import {Provider} from 'react-redux';
import {store} from './store';

const rootElement = document.getElementById('root');
render(
  <Router history={routerHistory}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  rootElement,
);
