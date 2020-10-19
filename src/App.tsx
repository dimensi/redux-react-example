import React from 'react';
import {useDispatch} from 'react-redux';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';
import {defaultRepo} from './config';
import {Issue} from './features/issue';
import {Issues} from './features/issues';
import {RepoMeta, setRepo} from './features/repository.store';
import {isMissmatchRepo} from './helpers';
import {useTypedSelector} from './store';
import './styles.css';

export default function App() {
  const error = useTypedSelector((state) => state.error);

  const match = useRouteMatch('/:org/:name');
  const routeParams = match ? (match.params as RepoMeta) : defaultRepo;
  const dispatch = useDispatch();
  const repoMeta = useTypedSelector((state) => state.repo);

  if (
    isMissmatchRepo(repoMeta, routeParams) &&
    routeParams.name &&
    routeParams.org
  ) {
    dispatch(setRepo(routeParams));
  }

  return (
    <div className="App">
      {error ? (
        <div>{error.message}</div>
      ) : (
        <Switch>
          <Route path="/:org/:name" exact>
            <Issues />
          </Route>
          <Route path="/:org/:name/issues/:id">
            <Issue />
          </Route>
          <Route>
            <Redirect to={`/${defaultRepo.org}/${defaultRepo.name}`} />
          </Route>
        </Switch>
      )}
    </div>
  );
}
