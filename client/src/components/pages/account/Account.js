import React, { useEffect } from "react";
import NotAuth from "../notauth/NotAuth";
import { Avatar, Text, Group } from "@mantine/core";
import { At } from "tabler-icons-react";
import "./Account.css";
import MovieList from "../../movielist/MovieList";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_STORAGE } from "../../../constants/actionTypes";
const UserInfoIcons = ({ user }) => {
	const { email, imageUrl, name } = user;
	return (
		<div>
			<Group noWrap>
				<Avatar src={imageUrl} size={70} radius="md" />
				<div>
					<Text size="xl" weight={550}>
						{name}
					</Text>

					<Group noWrap spacing={10} mt={3}>
						<At size={16} />
						<Text size="lg">{email}</Text>
					</Group>
				</div>
			</Group>
		</div>
	);
};

const Account = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.root.authReducer.userData);

	useEffect(() => {
		dispatch({ type: GET_USER_STORAGE });
	}, []);
	if (!localStorage.getItem("loginData")) {
		return <NotAuth />;
	}
	return (
		<>
			{user && (
				<div className="account">
					<div className="userInfo">
						<UserInfoIcons user={user} />
					</div>

					<div className="content">
						<MovieList movies={user.moviesList} />
					</div>
				</div>
			)}
		</>
	);
};
//style={{ position: "relative", left: "45%", top: 60 }}
export default Account;
