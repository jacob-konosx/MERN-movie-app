import { Link } from "react-router-dom";
import { CalendarTime, Camera, Clock, Movie, Star } from "tabler-icons-react";
import {
	Card,
	Text,
	Group,
	Badge,
	createStyles,
	useMantineTheme,
} from "@mantine/core";

import "./MovieCard.css";

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

const convertHMS = (totalSeconds) => {
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	const formattedHours = String(hours).padStart(2, "0");
	const formattedMinutes = String(minutes).padStart(2, "0");

	return `${formattedHours}:${formattedMinutes}`;
};

const MovieCard = ({ props }) => {
	const theme = useMantineTheme();
	const { classes } = useStyles(theme);

	// Inconsistent snake case is used for the variable names in the props object because that's how it is in the database
	const { _id, mode, title, averageMovieRating } = props;
	const { plot, genres, actors, directors, running_time_secs, release_date } =
		props.info;

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

						{typeof averageMovieRating === "number" && (
							<Badge size="sm">{averageMovieRating}</Badge>
						)}
					</Group>

					<Text size="sm" mt="xs">
						{plot.substring(0, 200)}...
					</Text>
				</Card.Section>

				<Group>
					<Text size="m" mt="xs">
						{genres.join(", ")}
					</Text>
				</Group>
			</Card>
		);
	}

	return (
		<Card
			withBorder
			radius="md"
			p="md"
			className={`${classes.card} bigCard`}
		>
			<Card.Section className={classes.section} mt="md">
				<h1>
					{title}{" "}
					<Badge className="badge" size="xl">
						{(typeof averageMovieRating === "number" &&
							averageMovieRating) ||
							"No Rating"}
					</Badge>
				</h1>

				<div className="mainContent">
					<div className="column extra">
						<h2>Basic Info</h2>
						<Text size="xl" mt="xs">
							<Movie />
							Genres: {genres.join(", ")}
						</Text>

						<Text size="xl" mt="xs">
							<Star />
							Actors: {actors.join(", ")}
						</Text>

						<Text size="xl" mt="xs">
							<Camera />
							Director/s: {directors.join(", ")}
						</Text>

						<Text size="xl" mt="xs">
							<Clock /> Movie length (H:M):{" "}
							{convertHMS(running_time_secs)}
						</Text>

						<Text size="xl" mt="xs">
							<CalendarTime /> Release Date:{" "}
							{release_date.substr(0, release_date.indexOf("T"))}
						</Text>
					</div>

					<div className="column plot">
						<h2>Storyline</h2>

						<Text size="xl" mt="xs">
							{plot}
						</Text>
					</div>
				</div>
			</Card.Section>
		</Card>
	);
};

export default MovieCard;
