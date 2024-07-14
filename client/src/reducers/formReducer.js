import {
	ADD_USER_MOVIE_LIST_SEARCH,
	CLEAR_SEARCH,
} from "../constants/actionTypes";

const formReducer = (state = { userMovieListSearch: null }, action) => {
	switch (action.type) {
		case ADD_USER_MOVIE_LIST_SEARCH:
			return { ...state, userMovieListSearch: action?.data };
		case CLEAR_SEARCH:
			return {
				...state,
				userMovieListSearch: null,
			};
		default:
			return state;
	}
};
export default formReducer;
