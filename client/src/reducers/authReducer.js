import { AUTH, LOGOUT, SET_USER_FIELD } from "../constants/actionTypes";

const authReducer = (state = { profile: null }, action) => {
	switch (action.type) {
		case AUTH:
			localStorage.setItem(
				"loginData",
				JSON.stringify({ ...action?.data })
			);
			return { ...state, profile: action?.data };
		case LOGOUT:
			localStorage.removeItem("loginData");
			return { ...state, profile: null };
		case SET_USER_FIELD:
			return {
				...state,
				profile: {
					...state.profile,
					result: {
						...state.profile.result,
						[action.payload.field]: action.payload.data,
					},
				},
			};
		default:
			return state;
	}
};
export default authReducer;
