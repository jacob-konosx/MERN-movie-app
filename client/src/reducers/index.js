import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import formReducer from "./formReducer";
import movieReducer from "./movieReducer";
export const rootReducer = combineReducers({
	authReducer,
	formReducer,
	movieReducer,
});
