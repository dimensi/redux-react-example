import {createAction, createReducer, createStore} from '@reduxjs/toolkit';
import {ErrorMessage} from '../api';

type ErrorState = ErrorMessage | null
export const setError = createAction<ErrorMessage>('SET_ERROR');

export const errorReducer = createReducer(null as ErrorState, builder => {
  builder.addCase(
    setError, (_, action) => action.payload
  )
})
