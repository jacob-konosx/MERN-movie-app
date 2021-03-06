import React, { useEffect, useState } from "react";
import {
	createStyles,
	MultiSelect,
	TextInput,
	Text,
	NumberInput,
	Textarea,
	Button,
	Center,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import "./Create.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotAuth from "../notauth/NotAuth";
import { createMovie } from "../../../actions/movies";
const useStyles = createStyles((theme) => ({
	root: {
		position: "relative",
	},

	input: {
		height: "auto",
		padding: 5,
	},

	label: {
		pointerEvents: "none",
		paddingTop: theme.spacing.sm / 2,
		zIndex: 1,
	},
}));

const Create = () => {
	// You can add these classes as classNames to any Mantine input, it will work the same
	const user = useSelector((state) => state.root.authReducer.profile);
	const { classes } = useStyles();
	const dispatch = useDispatch();
	const [genres, setGenres] = useState([]);
	const [movieDate, setMovieDate] = useState(new Date());
	const [length, setLength] = useState(new Date(0, 0, 0, 0, 0, 0, 0));
	const [movie, setMovie] = useState({
		title: "",
		year: new Date().getFullYear(),
		plot: "",
		running_time_secs: "",
		actors: [],
		directors: [],
		tempActor: "",
		tempDirector: "",
	});
	const [isValid, setIsValid] = useState(false);
	const navigate = useNavigate();
	const checkMovieValidity = () => {
		if (
			movie.title &&
			movie.year &&
			movie.plot &&
			movie.actors.length > 0 &&
			movie.directors.length > 0 &&
			genres.length > 0 &&
			movieDate &&
			length.getMinutes() + length.getHours() !== 0
		) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	};
	useEffect(() => {
		checkMovieValidity();
	}, [movie, length, movieDate, genres]);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setMovie({ ...movie, [name]: value });
	};
	const handleList = (value, field) => {
		setMovie((mov) => {
			return {
				...mov,
				[field]: mov[field].filter((i) => i !== value),
			};
		});
	};
	const handleAdd = (field, e) => {
		e.preventDefault();
		if (field === "tempActor") {
			if (movie.tempActor) {
				setMovie({
					...movie,
					tempActor: "",
					actors: [...movie.actors, movie.tempActor],
				});
			}
		} else {
			if (movie.tempDirector) {
				setMovie({
					...movie,
					tempDirector: "",
					directors: [...movie.directors, movie.tempDirector],
				});
			}
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isValid) {
			const release_date = `${movieDate.getFullYear()}-${
				movieDate.getMonth() + 1
			}-${movieDate.getDate()}T`;
			const running_time_secs =
				length.getHours() * 3600 + length.getMinutes() * 60;
			const creator = user._id;
			const newMovie = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: {
					info: {
						actors: movie.actors,
						directors: movie.directors,
						genres: genres,
						plot: movie.plot,
						release_date: release_date,
						running_time_secs: running_time_secs,
					},
					title: movie.title,
					year: movie.year,
					creator,
				},
			};
			dispatch(createMovie(newMovie));
			navigate("/");
		}
	};
	if (!localStorage.getItem("loginData")) {
		return (
			<NotAuth
				error={{
					text: "Login Required",
					description:
						"Authentication is required for the page you are trying to access.",
				}}
				button={{ text: "Take me to login page", path: "auth" }}
			/>
		);
	}
	return (
		<article className="form">
			<form>
				<h1 style={{ textAlign: "center" }}>Add a new movie</h1>
				<div className="form-control">
					<TextInput
						name="title"
						required={true}
						label="Title"
						placeholder="E.g Star Wars"
						classNames={classes}
						value={movie.title}
						onChange={handleChange}
					/>
				</div>
				<div className="form-control">
					<NumberInput
						onChange={(val) =>
							setMovie((m) => ({ ...m, year: val }))
						}
						name="year"
						required={true}
						label="Year"
						value={movie.year}
						min={1900}
						max={new Date().getFullYear()}
						step={1}
						classNames={classes}
					/>
				</div>
				<div className="form-control">
					<Textarea
						onChange={handleChange}
						name="plot"
						autosize
						minRows={2}
						label="Plot"
						required={true}
						classNames={classes}
						value={movie.plot}
					/>
				</div>

				<div className="form-control">
					<MultiSelect
						onChange={setGenres}
						name="genres"
						searchable
						data={[
							"Action",
							"Adventure",
							"Animated",
							"Biography",
							"Comedy",
							"Crime",
							"Dance",
							"Disaster",
							"Documentary",
							"Drama",
							"Erotic",
							"Family",
							"Fantasy",
							"Found Footage",
							"Historical",
							"Horror",
							"Independent",
							"Legal",
							"Live Action",
							"Martial Arts",
							"Musical",
							"Mystery",
							"Noir",
							"Performance",
							"Political",
							"Romance",
							"Satire",
							"Sci-Fi",
							"Short",
							"Silent",
							"Slasher",
							"Sports",
							"Spy",
							"Superhero",
							"Supernatural",
							"Suspense",
							"Teen",
							"Thriller",
							"War",
							"Western",
						]}
						placeholder="Choose Genres"
						label="Genres"
						required={true}
						value={genres}
					/>
				</div>
				<div className="form-control">
					<DatePicker
						onChange={setMovieDate}
						name="release_date"
						required={true}
						dropdownType="modal"
						placeholder="Pick date"
						label="Release Date"
						classNames={classes}
						value={movieDate}
					/>
				</div>
				<div className="form-control">
					<TimeInput
						onChange={setLength}
						name="running_time_secs"
						defaultValue={new Date()}
						label="Movie Length"
						required={true}
						value={length}
					/>
				</div>
				<div className="addField">
					<TextInput
						name="tempDirector"
						required={true}
						label="Directors"
						classNames={classes}
						id="addTextInput"
						value={movie.tempDirector}
						onChange={handleChange}
					/>
					<Button
						className="add-btn"
						onClick={(e) => handleAdd("tempDirector", e)}
					>
						Add
					</Button>
				</div>
				<label>
					Directors (Click to remove):
					<div>
						{movie.directors.map((director) => {
							return (
								<span key={director}>
									<span
										className="spanList"
										onClick={() =>
											handleList(director, "directors")
										}
									>
										{director}
									</span>
									<span>, </span>
								</span>
							);
						})}
					</div>
				</label>
				<div className="addField">
					<TextInput
						name="tempActor"
						required={true}
						label="Actors"
						classNames={classes}
						id="addTextInput"
						value={movie.tempActor}
						onChange={handleChange}
					/>
					<Button
						className="add-btn"
						onClick={(e) => handleAdd("tempActor", e)}
					>
						Add
					</Button>
				</div>
				<label>
					Actors (Click to remove):
					<div className="ingredients">
						{movie.actors.map((actor) => {
							return (
								<span key={actor}>
									<span
										className="spanList"
										onClick={() =>
											handleList(actor, "actors")
										}
									>
										{actor}
									</span>
									<span>, </span>
								</span>
							);
						})}
					</div>
				</label>
				<Center>
					<Button
						disabled={!isValid}
						mt="lg"
						size="lg"
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</Center>
			</form>
		</article>
	);
};
export default Create;
