import { AUTH } from "../constants/actionTypes";
import * as api from "../api/index";
export const signin = (form, navigate) => async (dispatch) => {
	try {
		const { data } = await api.signin(form);
		dispatch({ type: AUTH, data: data });
		navigate("/");
	} catch (error) {
		console.log(error);
	}
};
export const signup = (form, navigate) => async (dispatch) => {
	try {
		const { data } = await api.signup(form);
		console.log(data);
		dispatch({ type: AUTH, data: data });
		navigate("/");
	} catch (error) {
		console.log(error);
	}
};
