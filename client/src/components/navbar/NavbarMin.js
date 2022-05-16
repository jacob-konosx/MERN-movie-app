import React from "react";
import {
	Navbar,
	Center,
	Tooltip,
	UnstyledButton,
	createStyles,
	Group,
	Image,
} from "@mantine/core";
import { Home2, SquarePlus, User, Logout, Login } from "tabler-icons-react";
import logoImg from "../../media/logo.png";
import "./NavbarMin.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logoutUser } from "../../actions/auth";
const useStyles = createStyles((theme) => ({
	link: {
		width: 50,
		height: 50,
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

const mockdata = [
	{ icon: Home2, label: "Home", route: "/", needLogin: false },
	{ icon: SquarePlus, label: "Create", route: "/create", needLogin: true },
	{ icon: User, label: "Account", route: "/account", needLogin: true },
];
const NavbarMin = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.root.authReducer.profile);

	const links = mockdata.map((link, index) => {
		if (link.needLogin && !user) return null;

		return (
			<NavbarLink
				{...link}
				key={link.label}
				active={location.pathname === link.route}
				onClick={() => navigate(link.route)}
			/>
		);
	});

	return (
		<Navbar height={750} width={{ base: 80 }} p="md" className="navbar">
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
								dispatch(logoutUser());
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
export default NavbarMin;
