import React, {FC, FormEvent, useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {isMissmatchRepo} from '../../helpers';
import {useTypedSelector} from '../../store';
import {RepoMeta, setRepo} from '../repository.store';
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
      const {value: name} = form.elements.namedItem('name') as HTMLInputElement;

      dispatch(setRepo({org, name}));

      const repoURL = [org, name].join('/');
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
            name="name"
            placeholder="name"
            defaultValue={repoMeta.name}
          />
          <button>change</button>
        </form>
      </div>
      <Pagination page={page} lastPage={lastPage} />
      <IssuesList issues={issues} />
    </div>
  );
};
