import { SET_SEARCH } from "../constants/actionTypes";

const searchReducer = (state = [], action) => {
	switch (action.type) {
		case SET_SEARCH:
			return {
				...state,
				[action.payload.field]: action.payload.data,
			};
		default:
			return state;
	}
};
export default searchReducer;
