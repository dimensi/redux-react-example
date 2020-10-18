import React, {FC, FormEvent, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {useTypedSelector} from '../../store';
import {IssuesList} from './issues-list';
import {
  getIssuesThunk,
  IssuesRouteParams,
  RepoMeta,
  setRepo,
} from './issues.store';
import {Pagination} from './pagination';
import {useWatchPage} from './use-watch-page';

const isMissmatchRepo = (state: RepoMeta, route: RepoMeta) =>
  state.repo !== route.repo && state.org !== route.org;

export const Issues: FC = () => {
  const routeParams: IssuesRouteParams = useParams();
  const routerHistory = useHistory();
  const dispatch = useDispatch();
  const {page, lastPage, issues, ...meta} = useTypedSelector(
    (state) => state.issues,
  );

  if (isMissmatchRepo(meta, routeParams)) {
    dispatch(setRepo(routeParams));
  }

  useEffect(() => {
    if (!isMissmatchRepo(meta, routeParams)) {
      dispatch(getIssuesThunk(page));
    }
  }, [page, meta.repo, meta.org, routeParams, dispatch]);

  useWatchPage();

  const updateRepo = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const {value: org} = form.elements.namedItem('org') as HTMLInputElement;
      const {value: repo} = form.elements.namedItem('repo') as HTMLInputElement;

      dispatch(setRepo({org, repo}));

      const repoURL = [org, repo].join('/');
      if (!routerHistory.location.pathname.includes(`/${repoURL}`)) {
        routerHistory.push(`/${repoURL}/`);
      }
    },
    [dispatch, routerHistory],
  );

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <form onSubmit={updateRepo}>
          <input
            type="text"
            name="org"
            placeholder="org"
            defaultValue={meta.org}
          />
          <input
            type="text"
            name="repo"
            placeholder="repo"
            defaultValue={meta.repo}
          />
          <button>change</button>
        </form>
      </div>
      <Pagination page={page} lastPage={lastPage} />
      <IssuesList issues={issues} />
    </div>
  );
};
