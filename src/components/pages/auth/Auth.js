import React from "react";
import GoogleLogin from "react-google-login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Auth = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const googleSuccess = async (res) => {
		const result = res?.profileObj;
		const token = res?.tokenId;
		try {
			const response = await fetch(
				`http://localhost:5000/user/${result.googleId}`
			);

			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const record = await response.json();
			if (record) {
				dispatch({ type: "AUTH", data: { result: record, token } });
			} else {
				const userData = {
					email: result.email,
					name: result.name,
					imageUrl: result.imageUrl,
					uid: result.googleId,
					moviesList: [],
				};
				const response = await fetch("http://localhost:5000/user/add", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(userData),
				});
				if (!response.ok) {
					const message = `An error has occurred: ${response.statusText}`;
					window.alert(message);
					return;
				}
				dispatch({
					type: "AUTH",
					data: { result: userData, token },
				});
			}

			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};
	const googleFailure = (error) => {
		console.log("Google sign in was unsuccessful!");
		console.log(error);
	};
	return (
		<div style={{ margin: 0, position: "relative" }}>
			<GoogleLogin
				clientId="463318482360-obin8cipabv2aln3kmcngfu32qme8k19.apps.googleusercontent.com"
				onSuccess={googleSuccess}
				onFailure={googleFailure}
				cookiePolicy="single_host_origin"
			/>
		</div>
	);
};

export default Auth;
