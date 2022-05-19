import { Button, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../actions/auth";
import "./EditAccount.css";
const EditAccount = ({ user }) => {
	const [userInfo, setUserInfo] = useState(user);
	const dispatch = useDispatch();
	const [isValid, setIsValid] = useState(false);
	useEffect(() => {
		if (userInfo.name !== "" && isImage(userInfo.imageUrl)) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [userInfo]);
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setUserInfo({ ...userInfo, [name]: value });
	};
	const submitHandler = () => {
		dispatch(updateUser(userInfo.name, userInfo.imageUrl));
	};
	const isImage = (url) => {
		return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
	};

	return (
		<>
			{userInfo && (
				<div className="editAccount">
					<TextField
						className="nameField"
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
						variant="filled"
						label="Image URL"
						color="primary"
						value={userInfo.imageUrl}
						fullWidth
						name="imageUrl"
						onChange={handleChange}
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
