import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, logout, updateUser } from "../../actions/user";
import { TextField } from "@mui/material";
import Input from "../../pages/auth/Input";

import "./EditAccount.css";

const EditAccount = ({ userData }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userInfo, setUserInfo] = useState({ ...userData, update: false });
	const [password, setPassword] = useState({
		passwordFirst: "",
		passwordRepeat: "",
	});
	const [isInfoValid, setIsInfoValid] = useState(false);
	const [isPassValid, setIsPassValid] = useState(false);

	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (
			userInfo.name !== "" &&
			/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(
				userInfo.imageUrl
			) &&
			(userInfo.name !== userData.name ||
				userInfo.imageUrl !== userData.imageUrl)
		) {
			setIsInfoValid(true);
		} else {
			setIsInfoValid(false);
		}
	}, [userInfo, userData]);

	useEffect(() => {
		if (
			password.passwordFirst !== "" &&
			password.passwordRepeat !== "" &&
			password.passwordFirst === password.passwordRepeat
		) {
			setIsPassValid(true);
		} else {
			setIsPassValid(false);
		}
	}, [password]);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setUserInfo({ ...userInfo, [name]: value });
	};

	const handlePass = (e) => {
		setPassword({ ...password, [e.target.name]: e.target.value });
	};

	const submitHandler = () => {
		if (isInfoValid) {
			dispatch(updateUser(userInfo.name, userInfo.imageUrl));
			setUserInfo((old) => {
				return { ...old, update: !old.update };
			});
		}
		if (isPassValid) {
			dispatch(changePassword(password.passwordFirst, navigate));
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
				onChange={handleChange}
			/>

			<TextField
				className="editAccountInput"
				variant="filled"
				label="Image URL"
				color="primary"
				value={userInfo.imageUrl}
				fullWidth
				name="imageUrl"
				onChange={handleChange}
			/>

			<h3>Password</h3>
			<Input
				name="passwordFirst"
				label="Password"
				handleChange={handlePass}
				type={showPassword ? "text" : "password"}
				handleShowPassword={() => setShowPassword(!showPassword)}
			/>
			<Input
				name="passwordRepeat"
				label="Repeat Password"
				handleChange={handlePass}
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
