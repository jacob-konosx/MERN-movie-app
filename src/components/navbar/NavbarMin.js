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
import {
	Home2,
	SquarePlus,
	User,
	Settings,
	Logout,
	ListSearch,
} from "tabler-icons-react";
import logoImg from "../../media/logo.png";
import "./NavbarMin.css";
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
	{ icon: Home2, label: "Home", route: "/" },
	{ icon: ListSearch, label: "Search", route: "/search" },
	{ icon: SquarePlus, label: "Create", route: "/create" },
	{ icon: User, label: "Account", route: "/account" },
	{ icon: Settings, label: "Settings" },
];

const NavbarMin = () => {
	const links = mockdata.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={window.location.pathname === link.route}
			onClick={() => {
				window.location.href = link.route;
			}}
		/>
	));

	return (
		<Navbar height={750} width={{ base: 80 }} p="md" className="navbar">
			<Center>
				<a href="/">
					<Image src={logoImg} />
				</a>
			</Center>
			<Navbar.Section grow mt={50}>
				<Group direction="column" align="center" spacing={0}>
					{links}
				</Group>
			</Navbar.Section>
			<Navbar.Section>
				<Group direction="column" align="center" spacing={0}>
					<NavbarLink icon={Logout} label="Logout" />
				</Group>
			</Navbar.Section>
		</Navbar>
	);
};
export default NavbarMin;
