import {
	AUTH,
	LOGOUT,
	GET_USER_STORAGE,
	SET_USER_STORAGE,
} from "../constants/actionTypes";

const authReducer = (state = { authData: null }, action) => {
	switch (action.type) {
		case AUTH:
			localStorage.setItem(
				"loginData",
				JSON.stringify({ ...action?.data })
			);
			return { ...state, authData: action?.data };
		case LOGOUT:
			localStorage.removeItem("loginData");
			return { ...state, authData: null };
		case GET_USER_STORAGE:
			return {
				...state,
				userData: JSON.parse(localStorage.getItem("loginData")).result,
			};
		case SET_USER_STORAGE:
			return {
				...state,
				userData: {
					...state.userData,
					[action.payload.field]: action.payload.data,
				},
			};
		default:
			return state;
	}
};
export default authReducer;
