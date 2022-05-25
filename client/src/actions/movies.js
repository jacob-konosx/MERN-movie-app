import {
	FETCH_ALL,
	FETCH_ONE,
	SEARCH,
	SET_MOVIE_REVIEW_USER,
	SET_USER_FIELD,
	SET_REVIEWS,
	SET_MOVIE_AVERAGE,
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
export const updateMovieList = (movieList) => async (dispatch) => {
	try {
		await api.updateMovieList(movieList);
		dispatch({
			type: SET_USER_FIELD,
			payload: { field: "moviesList", data: movieList },
		});
	} catch (error) {
		console.log(error);
	}
};
export const addReview = (id, review) => async (dispatch) => {
	try {
		const { data } = await api.addReview(id, review);
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

export const getMoviesById = (reviewList) => async (dispatch) => {
	let movies = [];
	try {
		for (const rev of reviewList) {
			const { data } = await api.fetchMovie(rev.movieId);
			movies.push(data);
		}
		dispatch({ type: FETCH_ALL, payload: movies });
	} catch (error) {
		console.log(error);
	}
};
export const getMoviesAverage = (id) => async (dispatch) => {
	try {
		const { data } = await api.getMovieAvg(id);
		dispatch({ type: SET_MOVIE_AVERAGE, payload: data });
	} catch (error) {
		console.log(error);
	}
};
