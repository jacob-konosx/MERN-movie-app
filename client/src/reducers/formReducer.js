import { ADD_FORM, CLEAR_SEARCH } from "../constants/actionTypes";

const formReducer = (state = { formData: null }, action) => {
	switch (action.type) {
		case ADD_FORM:
			return { ...state, formData: action?.data };
		case CLEAR_SEARCH:
			return {
				...state,
				formData: { ...state.formData, title: null, id: null },
			};
		default:
			return state;
	}
};
export default formReducer;
