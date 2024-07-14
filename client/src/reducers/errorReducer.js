import { CLEAR_ERROR, SET_ERROR_FIELD } from "../constants/actionTypes";

const errorReducer = (state = {}, action) => {
	switch (action.type) {
		case SET_ERROR_FIELD:
			return {
				...state,
				[action.payload.field]: action.payload.data,
			};
		case CLEAR_ERROR:
			return {};
		default:
			return state;
	}
};
export default errorReducer;
