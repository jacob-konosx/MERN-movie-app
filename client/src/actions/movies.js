import {
	FETCH_ALL,
	FETCH_ONE,
	SEARCH,
	SET_USER_STORAGE,
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
			type: SET_USER_STORAGE,
			payload: { field: "moviesList", data: movieList },
		});
	} catch (error) {
		console.log(error);
	}
};
