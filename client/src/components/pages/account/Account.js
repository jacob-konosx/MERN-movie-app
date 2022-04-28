import React from "react";
import NotAuth from "../notauth/NotAuth";
import { Avatar, Text, Group } from "@mantine/core";
import { At } from "tabler-icons-react";
import "./Account.css";
import MovieList from "../../movielist/MovieList";
import { useSelector } from "react-redux";
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
	const user = useSelector((state) => state.root.authReducer.profile.result);
	if (!user) {
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
						<MovieList movies={user.moviesList} id={user._id} />
					</div>
				</div>
			)}
		</>
	);
};
export default Account;
