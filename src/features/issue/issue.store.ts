import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {Comment, ErrorMessage, getComments, getIssue, Issue} from '../../api';
import {RootState} from '../../store';
import {setError} from '../errors.store';

export interface IssueRouteParams {
  id: string;
}

interface IssueState {
  issue: Issue | null;
  comments: Comment[];
}

const initialState: IssueState = {
  issue: null,
  comments: [],
};

export const getIssueThunk = createAsyncThunk(
  'issue/getIssue',
  async (id: string, thunkApi) => {
    const {
      repo: {org, repo},
    } = thunkApi.getState() as RootState;
    try {
      return getIssue(org, repo, Number(id));
    } catch (err) {
      const e = (err as AxiosError<ErrorMessage>).response!.data;
      thunkApi.dispatch(setError(e));
      throw e;
    }
  },
);

export const getCommentsThunk = createAsyncThunk(
  'issue/getComments',
  async (commentsUrl: string, thunkApi) => {
    try {
      return getComments(commentsUrl);
    } catch (err) {
      const e = (err as AxiosError<ErrorMessage>).response!.data;
      thunkApi.dispatch(setError(e));
      throw e;
    }
  },
);

const issueSlice = createSlice({
  name: 'issue',
  initialState,
  reducers: {
    clearIssueState: (state) => {
      state.comments = [];
      state.issue = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getIssueThunk.fulfilled, (state, action) => {
      state.issue = action.payload;
    });

    builder.addCase(getCommentsThunk.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
  },
});

export const {
  reducer: issueReducer,
  actions: {clearIssueState},
} = issueSlice;
