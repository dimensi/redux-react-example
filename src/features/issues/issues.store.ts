import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {ErrorMessage, getIssues, Issue} from '../../api';
import {routerHistory} from '../../history';
import {RootState} from '../../store';
import {setError} from '../errors.store';

interface IssuesState {
  issues: Issue[];
  page: number;
  lastPage: number;
}

const initialState: IssuesState = {
  issues: [],
  page: 1,
  lastPage: 1,
};

export const getIssuesThunk = createAsyncThunk(
  'issues/getIssues',
  async (page: number, thunkApi) => {
    const {repo} = thunkApi.getState() as RootState;
    try {
      return await getIssues(repo.org, repo.name, page);
    } catch (err) {
      const e = (err as AxiosError<ErrorMessage>).response!.data;
      thunkApi.dispatch(setError(e));
      throw e;
    }
  },
);

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
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
  actions: {changePage},
} = issuesSlice;
