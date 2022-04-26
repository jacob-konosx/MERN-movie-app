import {
	FETCH_ALL,
	FETCH_ONE,
	SEARCH,
	CLEAR_SEARCH,
	ADD_MOVIE_LIST,
} from "../constants/actionTypes";

const movieReducer = (movies = [], action) => {
	switch (action.type) {
		case FETCH_ALL:
			return action.payload;
		case FETCH_ONE:
			return action.payload;
		case SEARCH:
			return { ...movies, searchRes: action.payload };
		case CLEAR_SEARCH:
			return { ...movies, searchRes: [] };
		case ADD_MOVIE_LIST:
			localStorage.setItem("loginData", action?.data);
			return { ...action?.data };
		default:
			return movies;
	}
};
export default movieReducer;
