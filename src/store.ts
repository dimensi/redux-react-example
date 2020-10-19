import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {errorReducer} from './features/errors.store';
import {issueReducer} from './features/issue/issue.store';
import {issuesReducer} from './features/issues/issues.store';
import {repoReducer} from './features/repository.store';

export const store = configureStore({
  reducer: {
    error: errorReducer,
    repo: repoReducer,
    issues: issuesReducer,
    issue: issueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
