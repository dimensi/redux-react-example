import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {defaultRepo} from '../config';

export type RepoMeta = typeof defaultRepo;

const initialState: RepoMeta = {org: '', name: ''};

const repoSlice = createSlice({
  name: 'repository',
  initialState,
  reducers: {
    setRepo: (state, action: PayloadAction<RepoMeta>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { reducer: repoReducer, actions: { setRepo }} = repoSlice