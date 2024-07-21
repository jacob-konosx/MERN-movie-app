import { SET_USER_MOVIE_FORM_SEARCH } from "../constants/actionTypes";

const formReducer = (state = { userMovieFormSearch: null }, action) => {
	switch (action.type) {
		case SET_USER_MOVIE_FORM_SEARCH:
			return {
				userMovieFormSearch: action.payload.data,
			};
		default:
			return state;
	}
};
export default formReducer;
