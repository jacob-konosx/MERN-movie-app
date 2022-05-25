import React from "react";
import { Link } from "react-router-dom";

import {
	Card,
	Text,
	Group,
	Badge,
	Button,
	createStyles,
	useMantineTheme,
} from "@mantine/core";
import "./BadgeCard.css";
const useStyles = createStyles((theme) => ({
	card: {
		backgroundColor: theme.white,
		margin: "auto",
	},

	section: {
		borderBottom: `1px solid ${theme.colors.gray[3]}`,
		paddingLeft: theme.spacing.md,
		paddingRight: theme.spacing.md,
		paddingBottom: theme.spacing.md,
	},

	label: {
		textTransform: "uppercase",
		fontSize: theme.fontSizes.xs,
		fontWeight: 700,
	},
}));
function convertHMS(value) {
	const sec = parseInt(value, 10); // convert value to number if it's string
	let hours = Math.floor(sec / 3600); // get hours
	let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
	// add 0 if value < 10; Example: 2 => 02
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	return hours + ":" + minutes; // Return is HH : MM : SS
}

const BadgeCard = ({ props }) => {
	const theme = useMantineTheme();
	const { classes } = useStyles(theme);
	const { _id, mode, title, year, average_rating } = props;
	const {
		rating,
		plot,
		genres,
		actors,
		directors,
		running_time_secs,
		release_date,
	} = props.info;

	if (mode === "small") {
		return (
			<Card
				id="smallCard"
				withBorder
				radius="md"
				className={classes.card}
			>
				<Card.Section className={classes.section}>
					<Group position="apart">
						<Text className="cardBody" size="xl" weight={500}>
							<Link className="titleLink" to={`/movie/${_id}`}>
								{title}
							</Link>
						</Text>
						<Badge size="sm">{rating}</Badge>
					</Group>
					<Text size="sm" mt="xs">
						{plot.substring(0, 200)}...
					</Text>
				</Card.Section>

				<Group>
					<Text size="m" mt="xs">
						{genres.join(", ")}
					</Text>
					{/* <Button
						component={Link}
						to={`/movie/${_id}`}
						radius="md"
						style={{ flex: 1 }}
					>
						Show details
					</Button> */}
				</Group>
			</Card>
		);
	} else {
		return (
			<Card
				withBorder
				radius="md"
				p="md"
				className={`${classes.card} bigCard`}
			>
				<Card.Section className={classes.section} mt="md">
					<Group position="apart">
						<h1>
							{title} - {year}
						</h1>
						<Badge className="badge" size="xl">
							{(typeof average_rating === "number" &&
								average_rating) ||
								"-"}
						</Badge>
					</Group>
					<div className="mainContent">
						<div className="column extra">
							<Text size="xl" mt="xs">
								Genres: {genres.join(", ")}
							</Text>
							<Text size="xl" mt="xs">
								Actors: {actors.join(", ")}
							</Text>
							<Text size="xl" mt="xs">
								Director/s: {directors.join(", ")}
							</Text>
							<Text size="xl" mt="xs">
								Movie length (H:M):{" "}
								{convertHMS(running_time_secs)}
							</Text>
							<Text size="xl" mt="xs">
								Release Date:{" "}
								{release_date.substr(
									0,
									release_date.indexOf("T")
								)}
							</Text>
						</div>
						<div className="column plot">
							<Text size="xl" mt="xs">
								{plot}
							</Text>
						</div>
					</div>
				</Card.Section>
			</Card>
		);
	}
};
export default BadgeCard;
