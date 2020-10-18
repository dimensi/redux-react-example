import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '../../store';
import { IssuesList } from './issues-list';
import { setRepo, setRepoFromForm, changePage, getIssuesThunk, IssuesRouteParams } from './issues.store';
import { Pagination } from './pagination';

const isNotDefinedRepo = (org: string, repo: string) => ![org, repo].every(Boolean)

export const Issues: FC = () => {
  const routeParams: IssuesRouteParams = useParams()
  const dispatch = useDispatch()
  const {page, repo, org, lastPage, issues} = useTypedSelector(
    (state) => state.issues,
  );

  if (isNotDefinedRepo(org, repo)) {
    dispatch(setRepo(routeParams))
  }
  
  useEffect(() => {
    if (!isNotDefinedRepo(org, repo)) {
      dispatch(getIssuesThunk(page))
    }
  }, [page, org, repo, dispatch])

  return (
    <div>
      <div style={{marginBottom: 24}}>
        <form onSubmit={event => dispatch(setRepoFromForm(event))}>
          <input
            type="text"
            name="org"
            placeholder="org"
            defaultValue={org}
          />
          <input
            type="text"
            name="repo"
            placeholder="repo"
            defaultValue={repo}
          />
          <button>change</button>
        </form>
      </div>
      <Pagination page={page} lastPage={lastPage} onChange={page => dispatch(changePage(page))} />
      <IssuesList issues={issues} />
    </div>
  );
};
