import axios from "axios";
import { store } from "..";
import { logoutUser } from "../actions/auth";

export const API = axios.create({
	withCredentials: true,
	baseURL: "https://mern-movielog.herokuapp.com",
});
//http://localhost:5000
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
		if (error?.response?.status === 403 && !prevRequest?.sent) {
			prevRequest.sent = true;
			const { data } = await API.post("/user/token");
			prevRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
			return API(prevRequest);
		}
		if (
			error?.response?.status === 406 ||
			error?.response?.status === 401
		) {
			await store.dispatch(logoutUser());
			window.location.href = "/auth";
		}
		return Promise.reject(error);
	}
);
let cancelToken;

export const fetchMovies = (page) => {
	if (typeof cancelToken != typeof undefined) {
		cancelToken.cancel("Operation canceled due to new request.");
	}
	cancelToken = axios.CancelToken.source();
	return API.get(`/movie?page=${page}`, { cancelToken: cancelToken.token });
};
export const fetchMovie = (id) => API.get(`/movie/${id}`);
export const searchMovies = (query) => API.get(`/movie/search?query=${query}`);
export const createMovie = (newMovie) => API.post("/movie", newMovie);
export const addReview = (id, review) =>
	API.post(`/movie/addReview/${id}`, review);
export const deleteReviewMovie = (movieId) =>
	API.post(`/movie/deleteReview/${movieId}`);
export const updateRev = (movieId, reviewText) =>
	API.post(`/movie/updateReview/${movieId}`, { reviewText });
export const searchAdvancedMovies = (searchQuery) =>
	API.post(`/movie/advancedSearch/`, { ...searchQuery });
export const getDirAndAct = () => API.get(`/movie/getDirectorsAndActors/`);

export const getUserInfo = (id) => API.get(`/user/getInfo/${id}`);

export const signin = (formData) => API.post("/user/signin", formData);
export const signup = (formData) => API.post("/user/signup", formData);
export const updateMovieList = (movieList) =>
	API.post(`/user/updateMovieList/`, movieList);
export const addReviewList = (review) =>
	API.post(`/user/addReviewList/`, review);
export const deleteReviewUser = (movieId) =>
	API.post(`/user/deleteReview/`, { movieId });
export const getNewToken = (token) => API.post(`/user/token/`, { token });
export const logout = () => API.post(`/user/logout/`);
export const updateAccount = (name, imageUrl) =>
	API.post(`/user/update/`, { name, imageUrl });
export const changePass = (password) =>
	API.post(`/user/changePassword/`, { password });
