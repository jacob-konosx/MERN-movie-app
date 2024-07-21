import { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Text, Group } from "@mantine/core";
import { At } from "tabler-icons-react";
import UserMovieList from "../../components/userMovieList/UserMovieList";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import EditAccount from "../../components/editAccount/EditAccount";
import UserReviewList from "../../components/userReviewList/UserReviewList";
import AlertMessage from "../alertMessage/AlertMessage";

import "./Account.css";

const Account = () => {
	// Needs to be named value for TabContext
	const [value, setValue] = useState("1");
	const user = useSelector((state) => state.root.userReducer.profile);

	if (!user) {
		return (
			<AlertMessage
				source="soloPage"
				alert={{
					text: "Login Required",
					description:
						"Authentication is required for the page you are trying to access.",
				}}
				button={{ text: "Take me to login page", path: "auth" }}
			/>
		);
	}

	return (
		<div className="account">
			<div className="userInfo">
				<Group noWrap>
					<Avatar src={user.imageUrl} size={70} radius="md" />
					<div>
						<Text size="xl" weight={550}>
							{user.name}
						</Text>

						<Group noWrap spacing={10} mt={3}>
							<At size={16} />
							<Text size="lg">{user.email}</Text>
						</Group>
					</div>
				</Group>
			</div>

			<TabContext value={value}>
				<Box
					className="tab"
					sx={{ borderBottom: 2, borderColor: "divider" }}
				>
					<TabList
						centered
						onChange={(event, newValue) => setValue(newValue)}
					>
						<Tab label="Movie List" value="1" />
						<Tab label="Reviews" value="2" />
						<Tab label="Account" value="3" />
					</TabList>
				</Box>

				<TabPanel className="movieListArea" value="1">
					<UserMovieList user={user} />
				</TabPanel>

				<TabPanel value="2">
					<UserReviewList user={user} />
				</TabPanel>

				<TabPanel value="3">
					<EditAccount user={user} />
				</TabPanel>
			</TabContext>
		</div>
	);
};
export default Account;
