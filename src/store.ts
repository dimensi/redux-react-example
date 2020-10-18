import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { errorReducer } from "./features/errors.store";
import { issuesReducer } from "./features/issues/issues.store";

export const store = configureStore({
  reducer: {
    error: errorReducer,
    issues: issuesReducer,
  }
})


export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector