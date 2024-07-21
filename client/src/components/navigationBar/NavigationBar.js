import {
	Navbar,
	Center,
	Tooltip,
	UnstyledButton,
	createStyles,
	Group,
	Image,
} from "@mantine/core";
import { Home2, User, Logout, Login, ListSearch } from "tabler-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../../actions/user";
import { useMediaQuery } from "@mui/material";
import logoImg from "../../media/logo.png";

import "./NavigationBar.css";

const useStyles = createStyles((theme) => ({
	link: {
		width: 40,
		height: 40,
		borderRadius: theme.radius.xl,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: theme.colors.gray[7],

		"&:hover": {
			backgroundColor: theme.colors.gray[0],
		},
	},

	active: {
		"&, &:hover": {
			backgroundColor: theme.colors[theme.primaryColor][0],
			color: theme.colors[theme.primaryColor][7],
		},
	},
}));

const NavbarLink = ({ icon: Icon, label, active, onClick }) => {
	const { classes, cx } = useStyles();

	return (
		<Tooltip
			label={label}
			position="right"
			withArrow
			transitionDuration={0}
		>
			<UnstyledButton
				onClick={onClick}
				className={cx(classes.link, { [classes.active]: active })}
			>
				<Icon />
			</UnstyledButton>
		</Tooltip>
	);
};

const navigationData = [
	{ icon: Home2, label: "Home", route: "/", needLogin: false },
	{ icon: ListSearch, label: "Search", route: "/search", needLogin: false },
	{ icon: User, label: "Account", route: "/account", needLogin: true },
];

const NavigationBar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.root.userReducer.profile);
	const isMobile = useMediaQuery("(max-width:768px)");

	const links = navigationData.map((link) => {
		if (link.needLogin && !user) return null;

		return (
			<NavbarLink
				className="navIcon"
				{...link}
				key={link.label}
				active={location.pathname === link.route}
				onClick={() => navigate(link.route)}
			/>
		);
	});

	if (isMobile) {
		return (
			<nav>
				{links}
				{user ? (
					<NavbarLink
						onClick={() => {
							dispatch(logout());
							navigate("/");
						}}
						icon={Logout}
						label="Logout"
					/>
				) : (
					<NavbarLink
						onClick={() => navigate("/auth")}
						icon={Login}
						label="Login"
					/>
				)}
			</nav>
		);
	}

	return (
		<Navbar p="md" className="navbar">
			<Center>
				<Link to="/">
					<Image src={logoImg} />
				</Link>
			</Center>

			<Navbar.Section grow mt={50}>
				<Group direction="column" align="center" spacing={0}>
					{links}
				</Group>
			</Navbar.Section>

			<Navbar.Section>
				<Group direction="column" align="center" spacing={0}>
					{user ? (
						<NavbarLink
							onClick={() => {
								dispatch(logout());
								navigate("/");
							}}
							icon={Logout}
							label="Logout"
						/>
					) : (
						<NavbarLink
							onClick={() => navigate("/auth")}
							icon={Login}
							label="Login"
						/>
					)}
				</Group>
			</Navbar.Section>
		</Navbar>
	);
};
export default NavigationBar;
