import React from "react";
import {
	createStyles,
	Container,
	Title,
	Text,
	Button,
	Group,
} from "@mantine/core";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 0,
	},

	inner: {
		position: "relative",
	},

	image: {
		position: "absolute",
		top: 0,
		right: 0,
		left: 0,
		zIndex: 0,
		opacity: 0.75,
	},

	content: {
		position: "relative",
		zIndex: 1,

		[theme.fn.smallerThan("sm")]: {
			paddingTop: 10,
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		textAlign: "center",
		fontWeight: 900,
		fontSize: 38,

		[theme.fn.smallerThan("sm")]: {
			fontSize: 32,
		},
	},

	description: {
		maxWidth: 540,
		margin: "auto",
		marginTop: theme.spacing.xl,
		marginBottom: theme.spacing.xl * 1.5,
	},
}));

const NotAuth = ({ error, button }) => {
	const { classes } = useStyles();

	return (
		<Container className={classes.root}>
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title className={classes.title}>{error.text}</Title>
					<Text
						color="dimmed"
						size="lg"
						align="center"
						className={classes.description}
					>
						{error.description}
					</Text>
					<Group position="center">
						<Button
							component={Link}
							to={`/${button.path}`}
							size="md"
						>
							{button.text}
						</Button>
					</Group>
				</div>
			</div>
		</Container>
	);
};
export default NotAuth;
