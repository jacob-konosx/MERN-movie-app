import { Button } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, logout, updateUser } from "../../actions/user";
import { TextField } from "@mui/material";
import Input from "../../pages/auth/Input";

import "./EditAccount.css";

const EditAccount = ({ user }) => {
	const { name, imageUrl } = user;

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userInfo, setUserInfo] = useState(user);
	const [passwords, setPasswords] = useState({
		firstPassword: "",
		secondPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const isInfoValid =
		userInfo.name !== "" &&
		/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(
			userInfo.imageUrl
		) &&
		(userInfo.name !== name || userInfo.imageUrl !== imageUrl);

	const isPassValid =
		passwords.firstPassword !== "" &&
		passwords.secondPassword !== "" &&
		passwords.firstPassword === passwords.secondPassword;

	const handleUserInfoChange = (e) => {
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	};

	const handlePasswordChange = (e) => {
		setPasswords({ ...passwords, [e.target.name]: e.target.value });
	};

	const submitHandler = () => {
		if (isInfoValid) {
			dispatch(updateUser(userInfo.name, userInfo.imageUrl));
		}
		if (isPassValid) {
			dispatch(changePassword(passwords.firstPassword));
			dispatch(logout());
			navigate("/auth");
		}
	};

	return (
		<div className="editAccount">
			<h3>Account Info</h3>
			<TextField
				className="editAccountInput"
				variant="filled"
				label="Name"
				color="primary"
				fullWidth
				value={userInfo.name}
				name="name"
				onChange={handleUserInfoChange}
			/>

			<TextField
				className="editAccountInput"
				variant="filled"
				label="Image URL"
				color="primary"
				value={userInfo.imageUrl}
				fullWidth
				name="imageUrl"
				onChange={handleUserInfoChange}
			/>

			<h3>Password</h3>
			<Input
				name="firstPassword"
				label="Password"
				handleChange={handlePasswordChange}
				type={showPassword ? "text" : "password"}
				handleShowPassword={() => setShowPassword(!showPassword)}
			/>
			<Input
				name="secondPassword"
				label="Repeat Password"
				handleChange={handlePasswordChange}
				type={showPassword ? "text" : "password"}
				handleShowPassword={() => setShowPassword(!showPassword)}
			/>

			<Button
				disabled={!isInfoValid && !isPassValid}
				onClick={submitHandler}
			>
				Update
			</Button>
		</div>
	);
};

export default EditAccount;
