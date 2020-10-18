import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {ErrorMessage, getIssues, Issue} from '../../api';
import {defaultRepo} from '../../config';
import {routerHistory} from '../../history';
import {RootState} from '../../store';
import {setError} from '../errors.store';

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
  actions: {changePage, setRepo},
} = issuesSlice;
