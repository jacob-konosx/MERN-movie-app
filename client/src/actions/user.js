import {
	AUTH,
	LOGOUT,
	SET_ERROR_FIELD,
	SET_USER_PROFILE_FIELD,
} from "../constants/actionTypes";
import * as api from "../api/index";

export const signin = (form, navigate) => async (dispatch) => {
	try {
		const { data } = await api.signin(form);
		dispatch({ type: AUTH, data: data });
		navigate("/");
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: { field: "signinError", data: error.response.status },
		});
	}
};
export const signup = (form, navigate) => async (dispatch) => {
	try {
		const { data } = await api.signup(form);
		dispatch({ type: AUTH, data: data });
		navigate("/");
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: { field: "signupError", data: error.response.status },
		});
	}
};
export const logout = () => async (dispatch) => {
	try {
		await api.logoutUser();
		dispatch({ type: LOGOUT });
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "logoutError",
				data: error.response.status,
			},
		});
	}
};
export const updateUser = (name, imageUrl) => async (dispatch) => {
	try {
		const { data } = await api.updateUser(name, imageUrl);
		dispatch({ type: AUTH, data: { result: data } });
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "updateUserError",
				data: error.response.status,
			},
		});
	}
};
export const changePassword = (password) => async (dispatch) => {
	try {
		await api.changePassword(password);
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "changePasswordError",
				data: error.response.status,
			},
		});
	}
};
export const addMoviesList = (movie) => async (dispatch) => {
	try {
		const { data } = await api.addMoviesList(movie);
		dispatch({
			type: SET_USER_PROFILE_FIELD,
			payload: { field: "moviesList", data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "addMoviesListError",
				data: error.response.status,
			},
		});
	}
};
export const updateMoviesList = (movie) => async (dispatch) => {
	try {
		const { data } = await api.updateMoviesList(movie);
		dispatch({
			type: SET_USER_PROFILE_FIELD,
			payload: { field: "moviesList", data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "updateMoviesListError",
				data: error.response.status,
			},
		});
	}
};
export const deleteMoviesList = (movieId) => async (dispatch) => {
	try {
		const { data } = await api.deleteMoviesList(movieId);
		dispatch({
			type: SET_USER_PROFILE_FIELD,
			payload: { field: "moviesList", data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "deleteMoviesListError",
				data: error.response.status,
			},
		});
	}
};
