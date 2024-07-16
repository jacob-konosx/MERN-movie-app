import { SET_USER_MOVIE_FORM_FIELD } from "../constants/actionTypes";

const formReducer = (state = { userMovieFormSearch: null }, action) => {
	switch (action.type) {
		case SET_USER_MOVIE_FORM_FIELD:
			return {
				...state,
				[action.payload.field]: action.payload.data,
			};
		default:
			return state;
	}
};
export default formReducer;
