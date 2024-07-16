import {
	createStyles,
	Container,
	Title,
	Text,
	Button,
	Group,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Divider } from "@mui/material";

import "./AlertMessage.css";

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 0,
		textAlign: "center",
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

	description: {
		maxWidth: 540,
		margin: "auto",
		marginTop: theme.spacing.xl,
		marginBottom: theme.spacing.xl * 1.5,
	},
}));

const AlertMessage = ({ alert, button }) => {
	const { classes } = useStyles();

	return (
		<Container className={classes.root}>
			<div className={classes.inner}>
				<div className={classes.content}>
					<Title className="alertText">{alert.text}</Title>
					<Text
						color="dimmed"
						size="lg"
						align="center"
						className={classes.description}
					>
						{alert.description}
					</Text>
					<Group position="center" className="alertButton">
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
			<Divider variant="fullWidth" className="userReviewDivider" />
		</Container>
	);
};
export default AlertMessage;
