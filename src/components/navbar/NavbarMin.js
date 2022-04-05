import React, { useState } from "react";
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
	SwitchHorizontal,
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
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[7],

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[5]
					: theme.colors.gray[0],
		},
	},

	active: {
		"&, &:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
					: theme.colors[theme.primaryColor][0],
			color: theme.colors[theme.primaryColor][
				theme.colorScheme === "dark" ? 4 : 7
			],
		},
	},
}));

// interface NavbarLinkProps {
//   icon: TablerIcon;
//   label: string;
//   active?: boolean;
//   onClick?(): void;
// }

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
	{ icon: SquarePlus, label: "Create", route: "/create" },
	{ icon: User, label: "Account", route: "/account" },
	{ icon: Settings, label: "Settings" },
];

const NavbarMin = () => {
	const [active, setActive] = useState(2);
	const links = mockdata.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={index === active}
			onClick={() => {
				setActive(index);
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
					<NavbarLink
						icon={SwitchHorizontal}
						label="Change account"
					/>
					<NavbarLink icon={Logout} label="Logout" />
				</Group>
			</Navbar.Section>
		</Navbar>
	);
};
export default NavbarMin;
