import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import userFormReducer from "./userFormReducer";
import movieReducer from "./movieReducer";
import errorReducer from "./errorReducer";
import advancedSearchReducer from "./advancedSearchReducer";

export const rootReducer = combineReducers({
	userReducer,
	userFormReducer,
	movieReducer,
	errorReducer,
	advancedSearchReducer,
});
