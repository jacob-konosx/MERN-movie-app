import { AUTH, LOGOUT, SET_USER_PROFILE_FIELD } from "../constants/actionTypes";

const authReducer = (state = { profile: null }, action) => {
	switch (action.type) {
		case AUTH:
			if (action?.data?.accessToken) {
				localStorage.setItem(
					"loginData",
					JSON.stringify({ accessToken: action?.data?.accessToken })
				);
			}
			return { ...state, profile: action?.data?.result };
		case LOGOUT:
			localStorage.removeItem("loginData");
			return { ...state, profile: null };
		case SET_USER_PROFILE_FIELD:
			return {
				...state,
				profile: {
					...state.profile,
					[action.payload.field]: action.payload.data,
				},
			};
		default:
			return state;
	}
};

export default authReducer;
