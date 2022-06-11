import {
	FETCH_ALL,
	SEARCH,
	SET_MOVIE_REVIEW_USER,
	SET_USER_FIELD,
	SET_REVIEWS,
	SET_SEARCH,
	SET_MOVIE_FIELD,
} from "../constants/actionTypes";
import * as api from "../api/index.js";

export const getMovies = (page) => async (dispatch) => {
	try {
		const { data } = await api.fetchMovies(page);
		dispatch({
			type: SET_MOVIE_FIELD,
			payload: {
				field: "homeMovies",
				data: {
					...data,
					pageCount: data.pageCount,
					currentPage: page,
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const getMovie = (id) => async (dispatch) => {
	try {
		const { data } = await api.fetchMovie(id);
		dispatch({
			type: SET_MOVIE_FIELD,
			payload: { field: "singleMovie", data },
		});
	} catch (error) {
		if (error.response.status === 404) {
			dispatch({
				type: SET_MOVIE_FIELD,
				payload: {
					field: "singleMovie",
					data: { movieNotFound: id },
				},
			});
		} else {
			console.log(error);
		}
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
export const updateReview = (movieId, reviewText) => async (dispatch) => {
	try {
		await api.updateRev(movieId, reviewText);
	} catch (error) {
		console.log(error);
	}
};
export const searchAdvMovies = (query) => async (dispatch) => {
	try {
		const { data } = await api.searchAdvancedMovies(query);
		dispatch({
			type: SET_SEARCH,
			payload: {
				field: "searchResult",
				data: { data: [...data], query },
			},
		});
	} catch (error) {
		console.log(error);
	}
};
export const getDirectorsAndActors = () => async (dispatch) => {
	try {
		const { data } = await api.getDirAndAct();
		dispatch({
			type: SET_SEARCH,
			payload: { field: "queryData", data: { ...data } },
		});
	} catch (error) {
		console.log(error);
	}
};
