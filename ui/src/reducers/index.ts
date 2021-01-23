import { combineReducers } from "@reduxjs/toolkit";
import tabSlice from "./tab";

const rootReducer = combineReducers({
    tabReducer: tabSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;