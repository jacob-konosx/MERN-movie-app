import { AUTH, LOGOUT, SET_USER_FIELD } from "../constants/actionTypes";
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
		dispatch({ type: AUTH, data: data });
		navigate("/");
	} catch (error) {
		console.log(error);
	}
};
export const addUserReviewList = (review) => async (dispatch) => {
	try {
		const { data } = await api.addReviewList(review);
		dispatch({
			type: SET_USER_FIELD,
			payload: { field: "reviewList", data },
		});
	} catch (error) {
		console.log(error);
	}
};
export const deleteReview = (movieId) => async (dispatch) => {
	try {
		await api.deleteReviewMovie(movieId);
		const { data } = await api.deleteReviewUser(movieId);
		dispatch({
			type: SET_USER_FIELD,
			payload: { field: "reviewList", data },
		});
	} catch (error) {
		console.log(error);
	}
};
export const logoutUser = () => async (dispatch) => {
	try {
		await api.logout();
		dispatch({ type: LOGOUT });
	} catch (error) {
		console.log(error);
	}
};
export const updateUser = (name, imageUrl) => async (dispatch) => {
	try {
		const { data } = await api.updateAccount(name, imageUrl);
		dispatch({ type: AUTH, data: { result: data } });
	} catch (error) {
		console.log(error);
	}
};
