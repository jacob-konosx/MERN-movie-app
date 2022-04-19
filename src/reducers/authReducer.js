import { AUTH, LOGOUT } from "../constants/actionTypes";

const authReducer = (state = { authData: null }, action) => {
	switch (action.type) {
		case AUTH:
			console.log(action?.data);
			localStorage.setItem(
				"loginData",
				JSON.stringify({ ...action?.data })
			);
			return { ...state, authData: action?.data };
		case LOGOUT:
			localStorage.removeItem("loginData");
			return { ...state, authData: null };
		default:
			return state;
	}
};
export default authReducer;
