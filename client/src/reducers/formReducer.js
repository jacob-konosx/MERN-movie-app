import { ADD_FORM, CLEAR_SEARCH } from "../constants/actionTypes";

const formReducer = (state = { isActive: false, formSearch: null }, action) => {
	switch (action.type) {
		case ADD_FORM:
			return { ...state, formSearch: action?.data };
		case CLEAR_SEARCH:
			return {
				...state,
				formSearch: { ...state.formData, title: null, id: null },
			};
		default:
			return state;
	}
};
export default formReducer;
