import { AUTH_ERROR, CLEAR_ERROR } from "../constants/actionTypes";

const errorReducer = (state = { authError: null }, action) => {
	switch (action.type) {
		case AUTH_ERROR:
			return { ...state, authError: action?.data };
		case CLEAR_ERROR:
			return { authError: null };
		default:
			return state;
	}
};
export default errorReducer;
