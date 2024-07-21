import {
	SET_MOVIE_REVIEW_USER_INFO,
	SET_USER_PROFILE_FIELD,
	SET_MOVIE_REVIEWS,
	SET_ADVANCED_SEARCH_FIELD,
	SET_MOVIE_FIELD,
	SET_ERROR_FIELD,
	CLEAR_ERROR,
} from "../constants/actionTypes.js";
import * as api from "../api/index.js";

export const getMovies = (page) => async (dispatch) => {
	try {
		const { data } = await api.getMovies(page);
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
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "getMoviesError",
				data: error.response.status,
			},
		});
	}
};

export const getMovie = (id) => async (dispatch) => {
	try {
		dispatch({ type: CLEAR_ERROR });

		const { data } = await api.getMovie(id);

		dispatch({
			type: SET_MOVIE_FIELD,
			payload: { field: "singleMovie", data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "getMovieError",
				data: error.response.status,
			},
		});
	}
};

export const searchMovie = (query) => async (dispatch) => {
	try {
		const { data } = await api.searchMovie(query);

		dispatch({
			type: SET_MOVIE_FIELD,
			payload: { field: "searchResult", data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "searchMovieError",
				data: error.response.status,
			},
		});
	}
};
export const addReview = (movieId, movieReview) => async (dispatch) => {
	try {
		const movieResponse = await api.addMovieReview(movieId, movieReview);
		const userResponse = await api.addUserReview({ movieId });

		dispatch({
			type: SET_MOVIE_REVIEWS,
			payload: { data: movieResponse.data },
		});
		dispatch({
			type: SET_USER_PROFILE_FIELD,
			payload: { field: "reviewList", data: userResponse.data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "addReviewError",
				data: error.response.status,
			},
		});
	}
};
export const getUserInfoAndSetToReview =
	(uid, review_id) => async (dispatch) => {
		try {
			const { data } = await api.getUserInfo(uid);
			dispatch({
				type: SET_MOVIE_REVIEW_USER_INFO,
				payload: { data, review_id },
			});
		} catch (error) {
			console.log(error);
			dispatch({
				type: SET_ERROR_FIELD,
				payload: {
					field: "getUserInfoError",
					data: error.response.status,
				},
			});
		}
	};

export const getMoviesById = (reviewList) => async (dispatch) => {
	let movies = [];
	try {
		for (const rev of reviewList) {
			const { data } = await api.getMovie(rev.movieId);
			movies.push(data);
		}
		return movies;
		// dispatch({
		// 	type: SET_MOVIE_FIELD,
		// 	payload: { field: "reviewedMovies", data: movies },
		// });
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "getMoviesByIdError",
				data: error.response.status,
			},
		});
	}
};
export const updateReviewText = (movieId, reviewText) => async (dispatch) => {
	try {
		await api.updateReviewText(movieId, reviewText);
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "updateReviewTextError",
				data: error.response.status,
			},
		});
	}
};
export const searchAdvancedMovie = (query) => async (dispatch) => {
	try {
		const { data } = await api.searchAdvancedMovie(query);
		dispatch({
			type: SET_ADVANCED_SEARCH_FIELD,
			payload: {
				field: "searchResult",
				data,
			},
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "searchAdvancedMovieError",
				data: error.response.status,
			},
		});
	}
};
export const getDirectorsAndActors = () => async (dispatch) => {
	try {
		const { data } = await api.getDirectorsAndActors();
		dispatch({
			type: SET_ADVANCED_SEARCH_FIELD,
			payload: { field: "queryData", data },
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "getDirectorsAndActorsError",
				data: error.response.status,
			},
		});
	}
};
export const deleteReview = (movieId) => async (dispatch) => {
	try {
		await api.deleteMovieReview(movieId);
		const { data } = await api.deleteUserReview(movieId);
		dispatch({
			type: SET_USER_PROFILE_FIELD,
			payload: { field: "reviewList", data },
		});
	} catch (error) {
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "deleteUserReviewError",
				data: error.response.status,
			},
		});
	}
};
