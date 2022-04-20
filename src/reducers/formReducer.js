import { ADD_FORM, CLEAR_FORM } from "../constants/actionTypes";

const formReducer = (state = { formData: null }, action) => {
	switch (action.type) {
		case ADD_FORM:
			return { ...state, formData: action?.data };
		case CLEAR_FORM:
			return {
				...state,
				formData: { ...state.formData, title: null, id: null },
			};
		default:
			return state;
	}
};
export default formReducer;
