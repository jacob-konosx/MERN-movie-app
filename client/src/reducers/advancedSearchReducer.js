import { SET_ADVANCED_SEARCH_FIELD } from "../constants/actionTypes";

const searchReducer = (state = [], action) => {
	switch (action.type) {
		case SET_ADVANCED_SEARCH_FIELD:
			return {
				...state,
				[action.payload.field]: action.payload.data,
			};
		default:
			return state;
	}
};

export default searchReducer;
