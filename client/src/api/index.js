import axios from "axios";
import { store } from "..";
import { logout } from "../actions/user";

export const API = axios.create({
	withCredentials: true,
	baseURL:
		process.env.REACT_APP_ENV === "PROD"
			? process.env.REACT_APP_PROD_API
			: process.env.REACT_APP_DEV_API,
});

API.interceptors.request.use(
	(config) => {
		if (
			!config.headers["Authorization"] &&
			localStorage.getItem("loginData")
		) {
			config.headers["Authorization"] = `Bearer ${
				JSON.parse(localStorage.getItem("loginData")).accessToken
			}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

API.interceptors.response.use(
	(response) => response,
	async (error) => {
		const prevRequest = error?.config;

		// If the error is due to an expired token, we will try to get a new token and resend the request
		if (error?.response?.status === 403 && !prevRequest?.sent) {
			const { data } = await API.post("/user/token");
			prevRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
			prevRequest.sent = true;

			return API(prevRequest);
		}

		// If the error is due to a 406 or 401 status code, we will log the user out and redirect them to the login page
		if (
			error?.response?.status === 406 ||
			error?.response?.status === 401
		) {
			await store.dispatch(logout());
			window.location.href = "/auth";
		}
		return Promise.reject(error);
	}
);

let cancelToken;

// API movie calls
export const getMovies = (page) => {
	// Cancel the previous request if ongoing before making a new request
	if (typeof cancelToken != typeof undefined) {
		cancelToken.cancel("Operation canceled due to new request.");
	}
	cancelToken = axios.CancelToken.source();
	return API.get(`/movie?page=${page}`, { cancelToken: cancelToken.token });
};
export const getMovie = (movieId) => API.get(`/movie/${movieId}`);
export const searchMovie = (query) => API.get(`/movie/search?q=${query}`);
export const createMovie = (newMovie) => API.post("/movie", newMovie);

export const addMovieReview = (movieId, review) => {
	return API.post(`/movie/addReview/${movieId}`, review);
};
export const deleteMovieReview = (movieId) => {
	return API.post(`/movie/deleteReview/${movieId}`);
};
export const updateReviewText = (movieId, reviewText) => {
	return API.post(`/movie/updateReview/${movieId}`, reviewText);
};
export const searchAdvancedMovie = (searchQuery) => {
	return API.post("/movie/advancedSearch/", { ...searchQuery });
};
export const getDirectorsAndActors = () => {
	return API.get("/movie/getDirectorsAndActors/");
};

// API user calls
export const getUserInfo = (userId) => API.get(`/user/getInfo/${userId}`);
export const signin = (formData) => API.post("/user/signin", formData);
export const signup = (formData) => API.post("/user/signup", formData);
export const getNewToken = (token) => API.post("/user/token/", { token });
export const logoutUser = () => API.post("/user/logout/");

export const updateMoviesList = (movie) => {
	return API.post("/user/updateMoviesList", movie);
};
export const addMoviesList = (movie) => {
	return API.post("/user/addMoviesList/", movie);
};
export const deleteMoviesList = (movieId) => {
	return API.post(`/user/deleteMoviesList/${movieId}`);
};
export const addUserReview = (review) => {
	return API.post("/user/addReviewList/", review);
};
export const deleteUserReview = (movieId) => {
	return API.post("/user/deleteReview/", { movieId });
};
export const updateUser = (name, imageUrl) => {
	return API.post("/user/update/", { name, imageUrl });
};
export const changePassword = (password) => {
	return API.post("/user/changePassword/", { password });
};
