import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin, signup } from "../../actions/user";
import { CLEAR_ERROR } from "../../constants/actionTypes";
import {
	Avatar,
	Button,
	Container,
	Grid,
	Paper,
	Typography,
} from "@mui/material";
import Input from "./Input";
import AlertMessage from "../alertMessage/AlertMessage";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import "./Auth.css";

const initialForm = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
};

const Auth = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [form, setForm] = useState(initialForm);
	const [isSignup, setIsSignup] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const user = useSelector((state) => state.root.userReducer?.profile);
	const signinError = useSelector(
		(state) => state.root.errorReducer?.signinError
	);
	const signupError = useSelector(
		(state) => state.root.errorReducer?.signupError
	);

	const isSignUpFormValid =
		form.email.length > 0 &&
		form.firstName.length > 0 &&
		form.lastName.length > 0 &&
		form.password.length > 0 &&
		form.confirmPassword.length > 0 &&
		form.password === form.confirmPassword;

	const switchMode = () => {
		setForm(initialForm);
		setShowPassword(false);
		setIsSignup((prevIsSignup) => !prevIsSignup);

		dispatch({ type: CLEAR_ERROR });
	};

	const handleAuth = (e) => {
		e.preventDefault();
		if (isSignup) {
			if (isSignUpFormValid) dispatch(signup(form, navigate));
		} else {
			dispatch(signin(form, navigate));
		}
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	if (user) {
		return (
			<AlertMessage
				alert={{
					text: "You are already logged in",
					description:
						"If you wish to sign in again or register a new user, sign out first.",
				}}
				button={{ text: "Take me home", path: "" }}
			/>
		);
	}

	return (
		<Container component="main" maxWidth="xs">
			<Paper className="authPaper" elevation={3}>
				<Avatar className="avatar">
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					{isSignup ? "Sign up" : "Sign in"}
				</Typography>

				<form onSubmit={handleAuth}>
					<Grid container spacing={2}>
						{isSignup && (
							<>
								<Input
									name="firstName"
									label="First Name"
									handleChange={handleChange}
									autoFocus
									half
									value={form.firstName}
								/>
								<Input
									name="lastName"
									label="Last Name"
									handleChange={handleChange}
									half
									value={form.lastName}
								/>
							</>
						)}
						<Input
							isError={signupError === 409 || signinError === 404}
							errorText={
								(signupError === 409 &&
									"User already exists") ||
								(signinError === 404 && "User doesn't exist")
							}
							name="email"
							label="Email Address"
							handleChange={handleChange}
							type="email"
							value={form.email}
						/>
						<Input
							isError={signinError === 400}
							errorText="Incorrect password"
							name="password"
							label="Password"
							handleChange={handleChange}
							type={showPassword ? "text" : "password"}
							handleShowPassword={() =>
								setShowPassword(!showPassword)
							}
							value={form.password}
						/>
						{isSignup && (
							<Input
								isError={form.password !== form.confirmPassword}
								errorText="Passwords do not match"
								name="confirmPassword"
								label="Repeat Password"
								handleChange={handleChange}
								type={showPassword ? "text" : "password"}
								value={form.confirmPassword}
							/>
						)}
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={
							(isSignup && !isSignUpFormValid) ||
							form.email === "" ||
							form.password === ""
						}
					>
						{isSignup ? "Sign Up" : "Sign In"}
					</Button>

					<Grid container justifyContent="flex-end">
						<Grid item>
							<Button onClick={switchMode}>
								{isSignup
									? "Already have an account? Sign in"
									: "Don't have an account? Sign Up"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default Auth;
