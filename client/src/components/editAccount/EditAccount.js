import { Button, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, logoutUser, updateUser } from "../../actions/auth";
import Input from "../Auth/Input";
import "./EditAccount.css";
const EditAccount = ({ user }) => {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState({ ...user, update: false });
	const dispatch = useDispatch();
	const [password, setPassword] = useState({
		password: "",
		passwordRepeat: "",
	});
	const [isValid, setIsValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	useEffect(() => {
		if (
			(userInfo.name !== "" &&
				isImage(userInfo.imageUrl) &&
				(userInfo.name !== user.name ||
					userInfo.imageUrl !== user.imageUrl)) ||
			(password.password !== "" &&
				password.passwordRepeat !== "" &&
				password.password === password.passwordRepeat)
		) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
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
		if (
			userInfo.name !== "" &&
			isImage(userInfo.imageUrl) &&
			(userInfo.name !== user.name || userInfo.imageUrl !== user.imageUrl)
		) {
			await dispatch(updateUser(userInfo.name, userInfo.imageUrl));
			setUserInfo((old) => {
				return { ...old, update: !old.update };
			});
		}
		if (
			password.password !== "" &&
			password.passwordRepeat !== "" &&
			password.password === password.passwordRepeat
		) {
			dispatch(changePassword(password.password, navigate));
			dispatch(logoutUser());
			navigate("/auth");
		}
	};
	const isImage = (url) => {
		return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
	};

	return (
		<>
			{userInfo && (
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
						name="password"
						label="Password"
						handleChange={handlePass}
						type={showPassword ? "text" : "password"}
						handleShowPassword={() =>
							setShowPassword(!showPassword)
						}
					/>
					<br />
					<Input
						name="passwordRepeat"
						label="Repeat Password"
						handleChange={handlePass}
						type={showPassword ? "text" : "password"}
						handleShowPassword={() =>
							setShowPassword(!showPassword)
						}
					/>

					<Button
						disabled={!isValid}
						style={{ marginTop: "2%" }}
						variant="outlined"
						color="primary"
						onClick={submitHandler}
					>
						Update
					</Button>
				</div>
			)}
		</>
	);
};

export default EditAccount;
