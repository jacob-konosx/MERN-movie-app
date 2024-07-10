import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, logoutUser, updateUser } from "../../actions/auth";
import Input from "../pages/auth/Input";
import "./EditAccount.css";
import { TextField } from "@mui/material";
const EditAccount = ({ userData }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userInfo, setUserInfo] = useState({ ...userData, update: false });
	const [password, setPassword] = useState({
		passwordFirst: "",
		passwordRepeat: "",
	});
	const [isValid, setIsValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (isInfoValid() || isPassValid()) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userInfo, password]);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setUserInfo({ ...userInfo, [name]: value });
	};

	const handlePass = (e) => {
		setPassword({ ...password, [e.target.name]: e.target.value });
	};

	const submitHandler = async () => {
		if (isInfoValid()) {
			await dispatch(updateUser(userInfo.name, userInfo.imageUrl));
			setUserInfo((old) => {
				return { ...old, update: !old.update };
			});
		}
		if (isPassValid()) {
			dispatch(changePassword(password.passwordFirst, navigate));
			dispatch(logoutUser());
			navigate("/auth");
		}
	};

	const isPassValid = () => {
		if (
			password.passwordFirst !== "" &&
			password.passwordRepeat !== "" &&
			password.passwordFirst === password.passwordRepeat
		)
			return true;
		return false;
	};
	const isInfoValid = () => {
		if (
			userInfo.name !== "" &&
			isImage(userInfo.imageUrl) &&
			(userInfo.name !== userData.name ||
				userInfo.imageUrl !== userData.imageUrl)
		)
			return true;
		return false;
	};
	const isImage = (url) => {
		return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
	};

	return (
		<div className="editAccount">
			<h3>Account Info</h3>
			<TextField
				variant="filled"
				label="Name"
				color="primary"
				fullWidth
				value={userInfo.name}
				name="name"
				onChange={handleChange}
			/>
			<br />
			<TextField
				style={{ marginBottom: "3%" }}
				variant="filled"
				label="Image URL"
				color="primary"
				value={userInfo.imageUrl}
				fullWidth
				name="imageUrl"
				onChange={handleChange}
			/>
			<h3>Password</h3>
			<br />
			<Input
				name="passwordFirst"
				label="Password"
				handleChange={handlePass}
				type={showPassword ? "text" : "password"}
				handleShowPassword={() => setShowPassword(!showPassword)}
			/>
			<br />
			<Input
				name="passwordRepeat"
				label="Repeat Password"
				handleChange={handlePass}
				type={showPassword ? "text" : "password"}
				handleShowPassword={() => setShowPassword(!showPassword)}
			/>
			<Button
				style={{ marginTop: "2%" }}
				disabled={!isValid}
				onClick={submitHandler}
			>
				Update
			</Button>
		</div>
	);
};

export default EditAccount;
