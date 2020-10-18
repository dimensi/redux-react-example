import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { defaultRepo } from './config';
// import { Issue } from './features/issue';
import { Issues } from './features/issues';
import { useTypedSelector } from './store';
import './styles.css';

export default function App() {
  const error = useTypedSelector(state => state.error)
  return (
    <div className="App">
      {error ? (
        <div>{error.message}</div>
      ) : (
        <Switch>
          <Route path="/:org/:repo" exact>
            <Issues />
          </Route>
          <Route path="/:org/:repo/issues/:id">
            {/* <Issue /> */}
          </Route>
          <Route>
            <Redirect to={`/${defaultRepo.org}/${defaultRepo.repo}`} />
          </Route>
        </Switch>
      )}
    </div>
  );
}
