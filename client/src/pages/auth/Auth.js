import { useEffect, useState } from "react";
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
	const [isPasswordValid, setIsPasswordValid] = useState(true);

	const user = useSelector((state) => state.root.authReducer?.profile);
	const signinError = useSelector(
		(state) => state.root.errorReducer?.signinError
	);
	const signupError = useSelector(
		(state) => state.root.errorReducer?.signupError
	);

	useEffect(() => {
		dispatch({ type: CLEAR_ERROR });
	}, [dispatch]);

	const handleShowPassword = () => setShowPassword(!showPassword);

	const switchMode = () => {
		dispatch({ type: CLEAR_ERROR });
		setForm(initialForm);
		setIsSignup((prevIsSignup) => !prevIsSignup);
		setShowPassword(false);
	};

	const checkPass = () => {
		if (form.password === form.confirmPassword) {
			setIsPasswordValid(true);
		} else {
			setIsPasswordValid(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSignup) {
			checkPass();
			if (isPasswordValid) {
				dispatch(signup(form, navigate));
			}
		} else {
			dispatch(signin(form, navigate));
		}
	};

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	if (!user) {
		return (
			<Container component="main" maxWidth="xs">
				<Paper className="paper" elevation={3}>
					<Avatar>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						{isSignup ? "Sign up" : "Sign in"}
					</Typography>
					<form className="form" onSubmit={handleSubmit}>
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
								isError={
									signupError === 409 || signinError === 404
								}
								errorText={
									(signupError === 409 &&
										"User already exists") ||
									(signinError === 404 &&
										"User doesn't exist")
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
								handleShowPassword={handleShowPassword}
								value={form.password}
							/>
							{isSignup && (
								<Input
									isError={!isPasswordValid}
									errorText="Passwords do not match"
									name="confirmPassword"
									label="Repeat Password"
									handleChange={handleChange}
									type="password"
									value={form.confirmPassword}
								/>
							)}
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
						>
							{isSignup ? "Sign Up" : "Sign In"}
						</Button>
						{/* <GoogleAuth /> */}
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
	}

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
};

export default Auth;
