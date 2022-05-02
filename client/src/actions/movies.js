import {
	FETCH_ALL,
	FETCH_ONE,
	SEARCH,
	SET_MOVIE_REVIEW_USER,
	SET_USER_MOVIES,
	SET_REVIEWS,
} from "../constants/actionTypes";

import * as api from "../api/index.js";

export const getMovies = (page) => async (dispatch) => {
	try {
		const { data } = await api.fetchMovies(page);

		dispatch({ type: FETCH_ALL, payload: data });
	} catch (error) {
		console.log(error);
	}
};

export const getMovie = (id) => async (dispatch) => {
	try {
		const { data } = await api.fetchMovie(id);

		dispatch({ type: FETCH_ONE, payload: data });
	} catch (error) {
		console.log(error);
	}
};

export const searchMovies = (query) => async (dispatch) => {
	try {
		const { data } = await api.searchMovies(query);

		dispatch({ type: SEARCH, payload: data });
	} catch (error) {
		console.log(error);
	}
};
export const createMovie = (newMovie) => async (dispatch) => {
	try {
		await api.createMovie(newMovie);
	} catch (error) {
		console.log(error);
	}
};
export const addMovieList = (id, movieList) => async (dispatch) => {
	try {
		await api.addMovieList(id, movieList);
		dispatch({
			type: SET_USER_MOVIES,
			payload: { field: "moviesList", data: movieList },
		});
	} catch (error) {
		console.log(error);
	}
};
export const addReview = (id, review) => async (dispatch) => {
	try {
		console.log(id, review);
		const { data } = await api.addReview(id, review);
		console.log(data);
		dispatch({ type: SET_REVIEWS, payload: { data } });
	} catch (error) {
		console.log(error);
	}
};
export const getUserInfo = (uid, review_id) => async (dispatch) => {
	try {
		const { data } = await api.getUserInfo(uid);
		dispatch({ type: SET_MOVIE_REVIEW_USER, payload: { data, review_id } });
	} catch (error) {
		console.log(error);
	}
};
