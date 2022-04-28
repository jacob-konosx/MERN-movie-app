import { Text, TextInput } from "@mantine/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../../actions/movies";
import { CLEAR_SEARCH } from "../../constants/actionTypes";
import "./Search.css";
const Search = ({ option }) => {
	const userMoviesList = useSelector(
		(state) => state.root.authReducer.profile?.result.moviesList
	);
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const searchRes = useSelector((state) => state.root.movieReducer.searchRes);

	useEffect(() => {
		if (searchQuery !== "") dispatch(searchMovies(searchQuery));
	}, [searchQuery, dispatch]);

	const handleChange = (e) => {
		setSearchQuery(e.currentTarget.value);
		dispatch({ type: CLEAR_SEARCH });
	};

	return (
		<div className="search">
			<TextInput
				label="Find movie"
				placeholder="Enter movie title"
				value={searchQuery}
				onChange={(e) => handleChange(e)}
			/>
			<div className={`dropdown-content`}>
				{searchRes &&
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
										: navigate(`/movie/${movie._id}`)
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
