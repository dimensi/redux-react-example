import {FormEvent} from 'react';
import {ErrorMessage, getIssues, Issue} from '../../api';
import {defaultRepo} from '../../config';
import {AxiosError} from 'axios';
import {setError} from '../errors.store';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../store';
import {routerHistory} from '../../history';

export type RepoMeta = typeof defaultRepo;
export type IssuesRouteParams = {repo: string; org: string};

interface IssuesState {
  issues: Issue[];
  org: string;
  repo: string;
  page: number;
  lastPage: number;
}

const initialState: IssuesState = {
  issues: [],
  org: '',
  repo: '',
  page: 1,
  lastPage: 1,
};

export const getIssuesThunk = createAsyncThunk(
  'issues/getIssues',
  async (page: number, thunkApi) => {
    const {issues} = thunkApi.getState() as RootState;
    try {
      return await getIssues(issues.org, issues.repo, page);
    } catch (err) {
      thunkApi.dispatch(
        setError((err as AxiosError<ErrorMessage>).response!.data),
      );
    }
  },
);

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setRepoFromForm: (
      state,
      action: PayloadAction<FormEvent<HTMLFormElement>>,
    ) => {
      const {payload: event} = action;
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const org = form.elements.namedItem('org') as HTMLInputElement;
      const repo = form.elements.namedItem('repo') as HTMLInputElement;

      Object.assign(state, {
        org: org.value,
        repo: repo.value,
      });

      // куда бля в редаксе side-effect запихивают? АЛЁ
      const repoURL = [org.value, repo.value].join('/');
      if (!routerHistory.location.pathname.includes(`/${repoURL}`)) {
        routerHistory.push(`/${repoURL}/`);
      }
    },
    setRepo: (state, action: PayloadAction<RepoMeta>) => {
      Object.assign(state, action.payload);
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
      routerHistory.push({
        ...routerHistory.location,
        search: action.payload > 1 ? `page=${action.payload}` : '',
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getIssuesThunk.fulfilled, (state, action) => {
      state.issues = action.payload!.issues;
      state.lastPage = action.payload!.pageCount;
    });
  },
});

export const {
  reducer: issuesReducer,
  actions: {changePage, setRepo, setRepoFromForm},
} = issuesSlice;
