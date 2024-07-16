import { Text } from "@mantine/core";
import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchMovie } from "../../actions/movie";
import {
	SET_MOVIE_FIELD,
	SET_USER_MOVIE_FORM_FIELD,
} from "../../constants/actionTypes";
import TextField from "@mui/material/TextField";

import "./MovieSearchField.css";

const MovieSearchField = ({ option }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	const searchResult = useSelector(
		(state) => state.root.movieReducer?.searchResult
	);
	const userMoviesList = useSelector(
		(state) => state.root.userReducer.profile?.moviesList
	);

	useEffect(() => {
		dispatch({
			type: SET_MOVIE_FIELD,
			payload: {
				field: "searchResult",
				data: [],
			},
		});
	}, [dispatch]);

	useEffect(() => {
		if (searchQuery !== "") {
			dispatch(searchMovie(searchQuery));
		}
	}, [searchQuery, dispatch]);

	const handleChange = (e) => {
		setSearchQuery(e.currentTarget.value);
	};

	const goSearch = (movie) => {
		navigate(`/movie/${movie._id}`);
		dispatch({
			type: SET_MOVIE_FIELD,
			payload: { field: "searchResult", data: [] },
		});
	};

	return (
		<div className="search">
			<TextField
				fullWidth
				focused
				label="Search"
				size="small"
				placeholder="Movie title"
				value={searchQuery}
				onChange={(e) => handleChange(e)}
			/>
			<div className={`dropdown-content`}>
				{Array.isArray(searchResult) &&
					searchResult.map((movie) => {
						// If the movie is already in the user's list, don't show it
						if (option === "userMovieList" && userMoviesList) {
							if (
								userMoviesList.some((m) => m.id === movie._id)
							) {
								return <Fragment key={movie._id} />;
							}
						}

						return (
							<Text
								className="searchMovie"
								key={movie._id}
								onClick={() =>
									option === "userMovieList"
										? dispatch({
												type: SET_USER_MOVIE_FORM_FIELD,
												payload: {
													field: "userMovieFormSearch",
													data: {
														title: movie.title,
														id: movie._id,
													},
												},
										  })
										: goSearch(movie)
								}
							>
								{movie.title}
							</Text>
						);
					})}
			</div>
		</div>
	);
};

export default MovieSearchField;
