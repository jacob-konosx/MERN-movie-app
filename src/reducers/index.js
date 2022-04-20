import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import formReducer from "./formReducer";
export const rootReducer = combineReducers({ authReducer, formReducer });
