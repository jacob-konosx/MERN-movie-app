import { AUTH, SET_USER_FIELD } from "../constants/actionTypes";
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
export const addUserReviewList = (id, review) => async (dispatch) => {
	try {
		const { data } = await api.addReviewList(id, review);
		dispatch({
			type: SET_USER_FIELD,
			payload: { field: "reviewList", data },
		});
	} catch (error) {
		console.log(error);
	}
};
export const deleteReview = (userId, movieId) => async (dispatch) => {
	try {
		await api.deleteReviewMovie(movieId, userId);
		const { data } = await api.deleteReviewUser(userId, movieId);
		dispatch({
			type: SET_USER_FIELD,
			payload: { field: "reviewList", data },
		});
	} catch (error) {
		console.log(error);
	}
};
