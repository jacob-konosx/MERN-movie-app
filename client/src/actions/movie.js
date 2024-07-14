import {
	FETCH_ALL,
	QUERY_MOVIE,
	SET_USER_MOVIE_REVIEW,
	SET_USER_FIELD,
	SET_REVIEWS,
	SET_SEARCH_FIELD,
	SET_MOVIE_FIELD,
	SET_ERROR_FIELD,
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

		dispatch({ type: QUERY_MOVIE, payload: data });
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
export const createMovie = (newMovie) => async (dispatch) => {
	try {
		await api.createMovie(newMovie);
	} catch (error) {
		console.log(error);
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "createMovieError",
				data: error.response.status,
			},
		});
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
		dispatch({
			type: SET_ERROR_FIELD,
			payload: {
				field: "updateMovieListError",
				data: error.response.status,
			},
		});
	}
};
export const addReview =
	(movieId, movieReview, userReview) => async (dispatch) => {
		try {
			const movieResponse = await api.addMovieReview(
				movieId,
				movieReview
			);
			const userResponse = await api.addUserReview(userReview);

			dispatch({
				type: SET_REVIEWS,
				payload: { data: movieResponse.data },
			});
			dispatch({
				type: SET_USER_FIELD,
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
				type: SET_USER_MOVIE_REVIEW,
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
		dispatch({ type: FETCH_ALL, payload: movies });
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
			type: SET_SEARCH_FIELD,
			payload: {
				field: "searchResult",
				data: { data: [...data], query },
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
			type: SET_SEARCH_FIELD,
			payload: { field: "queryData", data: { ...data } },
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
			type: SET_USER_FIELD,
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
