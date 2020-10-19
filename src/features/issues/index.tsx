import React, {FC, FormEvent, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {isMissmatchRepo} from '../../helpers';
import {useTypedSelector} from '../../store';
import {RepoMeta, setRepo} from '../repo.store';
import {IssuesList} from './issues-list';
import {getIssuesThunk} from './issues.store';
import {Pagination} from './pagination';
import {useWatchPage} from './use-watch-page';

export const Issues: FC = () => {
  const routeParams: RepoMeta = useParams();
  const routerHistory = useHistory();
  const dispatch = useDispatch();
  const {page, lastPage, issues} = useTypedSelector((state) => state.issues);

  const repoMeta = useTypedSelector((state) => state.repo);

  useEffect(() => {
    if (!isMissmatchRepo(repoMeta, routeParams)) {
      dispatch(getIssuesThunk(page));
    }
  }, [page, repoMeta, routeParams, dispatch]);

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
            defaultValue={repoMeta.org}
          />
          <input
            type="text"
            name="repo"
            placeholder="repo"
            defaultValue={repoMeta.repo}
          />
          <button>change</button>
        </form>
      </div>
      <Pagination page={page} lastPage={lastPage} />
      <IssuesList issues={issues} />
    </div>
  );
};
