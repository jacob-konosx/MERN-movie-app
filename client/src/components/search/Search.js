import { Text } from "@mantine/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../../actions/movies";
import { CLEAR_SEARCH } from "../../constants/actionTypes";
import TextField from "@mui/material/TextField";

import "./Search.css";

const Search = ({ option }) => {
	const userMoviesList = useSelector(
		(state) => state.root.authReducer.profile?.moviesList
	);
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const searchRes = useSelector(
		(state) => state.root.movieReducer?.searchRes
	);

	useEffect(() => {
		if (searchQuery !== "") dispatch(searchMovies(searchQuery));
	}, [searchQuery, dispatch]);

	const handleChange = (e) => {
		setSearchQuery(e.currentTarget.value);
	};

	const goSearch = (movie) => {
		navigate(`/movie/${movie._id}`);
		dispatch({
			type: CLEAR_SEARCH,
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
				{Array.isArray(searchRes) &&
					searchRes.map((movie) => {
						if (option === "movieForm" && userMoviesList) {
							const cloneMovie = userMoviesList.filter(
								(m) => m.id === movie._id
							);
							if (cloneMovie.length >= 1)
								return (
									<React.Fragment
										key={movie._id}
									></React.Fragment>
								);
						}
						return (
							<Text
								className="searchMovie"
								key={movie._id}
								onClick={() =>
									option === "movieForm"
										? dispatch({
												type: "ADD_FORM",
												data: {
													title: movie.title,
													id: movie._id,
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

export default Search;
