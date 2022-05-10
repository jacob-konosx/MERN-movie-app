import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:5000" });
API.interceptors.request.use((req) => {
	if (localStorage.getItem("loginData")) {
		req.headers.Authorization = `Bearer ${
			JSON.parse(localStorage.getItem("loginData")).token
		}`;
	}
	return req;
});

export const fetchMovies = (page) => API.get(`/movie?page=${page}`);
export const fetchMovie = (id) => API.get(`/movie/${id}`);
export const searchMovies = (query) => API.get(`/movie/search?query=${query}`);

export const createMovie = (newMovie) => API.post("/movie", newMovie);
export const addReview = (id, review) =>
	API.post(`/movie/addReview/${id}`, review);
export const deleteReviewMovie = (movieId, userId) =>
	API.post(`/movie/deleteReview/${movieId}`, { userId });

export const getUserInfo = (id) => API.get(`/user/getInfo/${id}`);

export const signin = (formData) => API.post("/user/signin", formData);
export const signup = (formData) => API.post("/user/signup", formData);
export const updateMovieList = (id, movieList) =>
	API.post(`/user/updateMovieList/${id}`, movieList);
export const addReviewList = (id, review) =>
	API.post(`/user/addReviewList/${id}`, review);
export const deleteReviewUser = (userId, movieId) =>
	API.post(`/user/deleteReview/${userId}`, { movieId });
