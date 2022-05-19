import React, { useState } from "react";
import NotAuth from "../notauth/NotAuth";
import { Avatar, Text, Group } from "@mantine/core";
import { At } from "tabler-icons-react";
import "./Account.css";
import MovieList from "../../movielist/MovieList";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ReviewList from "../../reviewlist/ReviewList";
import EditAccount from "../../editAccount/EditAccount";

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
	const [value, setValue] = useState("1");
	const user = useSelector((state:any) => state.root.authReducer.profile);
	if (!user) {
		return <NotAuth error={{text:"Login Required",description:"Authentication is required for the page you are trying to access."}} button={{text:'Take me to login page', path:'auth'}}/>;
	}
const handleChange = (event: React.SyntheticEvent, newValue: string) => {
	setValue(newValue);
};
	return (
				<div className="account">
					<div className="userInfo">
						<UserInfoIcons user={user} />
					</div>

					<TabContext  value={value}>
						<Box className="tab" sx={{ borderBottom: 2, borderColor: "divider" }}>
							<TabList
							centered
								onChange={handleChange}
							>
								<Tab label="Movie List" value="1" />
								<Tab label="Reviews" value="2" />
								<Tab label="Account" value="3" />
							</TabList>
						</Box>
						<TabPanel value="1">
							<MovieList movies={user.moviesList}/>
						</TabPanel>
						<TabPanel value="2"><ReviewList userReviews={user?.reviewList}/></TabPanel>
						<TabPanel value="3"><EditAccount user={{name:user?.name, imageUrl:user?.imageUrl}}/></TabPanel>
					</TabContext>
				</div>
	);
};
export default Account;
