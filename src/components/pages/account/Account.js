import React from "react";
import { useState } from "react";
import NotAuth from "../notauth/NotAuth";
import { Avatar, Text, Group } from "@mantine/core";
import { At } from "tabler-icons-react";
import "./Account.css";
import MovieList from "../../movielist/MovieList";
const UserInfoIcons = ({ user }) => {
	const { email, imageUrl, name } = user;
	return (
		<div>
			<Group noWrap>
				<Avatar src={imageUrl} size={70} radius="md" />
				<div>
					{/* <Text
						size="xs"
						sx={{ textTransform: "uppercase" }}
						weight={700}
						color="dimmed"
					>
						{title}
					</Text> */}

					<Text size="xl" weight={550}>
						{name}
					</Text>

					<Group noWrap spacing={10} mt={3}>
						<At size={16} />
						<Text size="lg">{email}</Text>
					</Group>

					{/* <Group noWrap spacing={10} mt={5}>
						<PhoneCall size={16} className={classes.icon} />
						<Text size="xs" color="dimmed">
							{phone}
						</Text>
					</Group> */}
				</div>
			</Group>
		</div>
	);
};

const Account = () => {
	const [user, setUser] = useState(
		localStorage.getItem("loginData")
			? JSON.parse(localStorage.getItem("loginData")).result
			: null
	);
	if (!localStorage.getItem("loginData")) {
		return <NotAuth />;
	}
	return (
		<div className="account">
			<div className="userInfo">
				<UserInfoIcons user={user} />
			</div>

			<div className="content">
				<MovieList movies={user.moviesList} />
				{/* <h2 style={{ textAlign: "center" }}>Movies List</h2>
				<div className="movieList">
					{user.moviesList.map((movie) => {
						return (
							<div key={movie.id} className="userMovie">
								<h3 className="movieMain">
									<a href={`/movie/${movie.id}`}>
										{movie.title}
									</a>{" "}
									- {movie.rating}/10
								</h3>
								<h3 className="status"> {movie.status}</h3>
							</div>
						);
					})}
				</div> */}
			</div>
		</div>
	);
};
//style={{ position: "relative", left: "45%", top: 60 }}
export default Account;
