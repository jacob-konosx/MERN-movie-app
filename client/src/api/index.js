import axios from "axios";
import { store } from "..";
import { logout } from "../actions/user";

export const API = axios.create({
	withCredentials: true,
	baseURL:
		process.env.ENV === "PROD"
			? "https://flix-log-server.vercel.app"
			: "http://localhost:5000",
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
export const getMovie = (id) => API.get(`/movie/${id}`);
export const searchMovie = (query) => API.get(`/movie/search?q=${query}`);
export const createMovie = (newMovie) => API.post("/movie", newMovie);
export const addMovieReview = (id, review) =>
	API.post(`/movie/addReview/${id}`, review);
export const deleteMovieReview = (movieId) =>
	API.post(`/movie/deleteReview/${movieId}`);
export const updateReviewText = (movieId, reviewText) =>
	API.post(`/movie/updateReview/${movieId}`, { reviewText });
export const searchAdvancedMovie = (searchQuery) =>
	API.post("/movie/advancedSearch/", { ...searchQuery });
export const getDirectorsAndActors = () =>
	API.get("/movie/getDirectorsAndActors/");

// API user calls
export const getUserInfo = (id) => API.get(`/user/getInfo/${id}`);
export const signin = (formData) => API.post("/user/signin", formData);
export const signup = (formData) => API.post("/user/signup", formData);
export const updateMovieList = (movieList) =>
	API.post("/user/updateMovieList/", movieList);
export const addUserReview = (review) =>
	API.post("/user/addReviewList/", review);
export const deleteUserReview = (movieId) =>
	API.post("/user/deleteReview/", { movieId });
export const getNewToken = (token) => API.post("/user/token/", { token });
export const logoutUser = () => API.post("/user/logout/");
export const updateUser = (name, imageUrl) =>
	API.post("/user/update/", { name, imageUrl });
export const changePassword = (password) =>
	API.post("/user/changePassword/", { password });
