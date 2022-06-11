import { Divider, Grid, Paper, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Button, MultiSelect, NumberInput, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import "./Search.css";
import {
	getDirectorsAndActors,
	searchAdvMovies,
} from "../../../actions/movies";
import { Link } from "react-router-dom";
import { SET_SEARCH } from "../../../constants/actionTypes";
const defaultQuery = { title: "", year: undefined };

const Search = () => {
	const dispatch = useDispatch();
	const searchResults = useSelector(
		(state) => state.root.searchReducer?.searchResult
	);
	const queryData = useSelector(
		(state) => state.root.searchReducer?.queryData
	);
	const [query, setQuery] = useState(defaultQuery);
	const [genres, setGenres] = useState([]);
	const [actors, setActors] = useState([]);
	const [directors, setDirectors] = useState([]);
	const [isQueryValid, setIsQueryValid] = useState(false);
	const [tempQuery, setTempQuery] = useState(null);
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setQuery({ ...query, [name]: value });
	};

	const checkValidity = () => {
		if (
			(query.title !== "" ||
				query.year ||
				genres.length > 0 ||
				actors.length > 0 ||
				directors.length > 0) &&
			!_.isEqual(tempQuery, { ...query, genres, actors, directors })
		) {
			setIsQueryValid(true);
		} else {
			setIsQueryValid(false);
		}
	};
	useEffect(() => {
		dispatch(getDirectorsAndActors());
	}, []);

	useEffect(() => {
		checkValidity();
	}, [query, genres, actors, directors, tempQuery]);

	const handleSearch = (e) => {
		e.preventDefault();
		const finishedQuery = { ...query, genres, actors, directors };
		if (isQueryValid) {
			dispatch(searchAdvMovies(finishedQuery));
			setTempQuery(finishedQuery);
		}
	};
	return (
		<>
			{queryData ? (
				<div className="searchMain">
					<h1 style={{ textAlign: "center" }}>Advanced Search</h1>
					<TextField
						fullWidth
						focused
						label="Search"
						size="small"
						name="title"
						placeholder="Movie title"
						value={query.title}
						onChange={(e) => handleChange(e)}
					/>
					<div className="secondOpt">
						<MultiSelect
							className="searchGenres"
							onChange={setGenres}
							name="genres"
							searchable
							data={queryData.genres}
							placeholder="Choose Genres"
							label="Genres"
							value={genres}
						/>
						<NumberInput
							className="searchYear"
							label="Year"
							value={query.year}
							max={new Date().getFullYear()}
							step={1}
							onChange={(val) =>
								setQuery({ ...query, year: val })
							}
						/>
					</div>
					<div className="secondOpt">
						<MultiSelect
							limit={200}
							className="searchGenres"
							onChange={setActors}
							name="actors"
							searchable
							data={queryData.actors}
							placeholder="Searching displays more actors"
							label="Actors"
							value={actors}
						/>
						<MultiSelect
							limit={200}
							className="searchYear"
							onChange={setDirectors}
							name="directors"
							searchable
							data={queryData.directors}
							placeholder="Searching displays more directors"
							label="Directors"
							value={directors}
						/>
					</div>
					<div style={{ textAlign: "center" }}>
						{(isQueryValid || searchResults) && (
							<Text
								onClick={() => {
									setGenres([]);
									setDirectors([]);
									setActors([]);
									setTempQuery(null);
									setQuery(defaultQuery);
									dispatch({
										type: SET_SEARCH,
										payload: {
											field: "searchResult",
											data: null,
										},
									});
								}}
								className="clearBtn"
							>
								Clear
							</Text>
						)}
						<Button
							disabled={!isQueryValid}
							className="searchBtn"
							onClick={(e) => handleSearch(e)}
						>
							Search
						</Button>
					</div>

					{searchResults && (
						<div>
							{searchResults.data.length > 0 ? (
								<Paper
									style={{
										padding: "0px 20px",
										paddingTop: "20px",
									}}
								>
									{searchResults.data.map((movie) => {
										return (
											<React.Fragment key={movie._id}>
												<Grid
													style={{
														marginBottom: "0px",
													}}
													container
													wrap="nowrap"
												>
													<Grid item xs zeroMinWidth>
														<h1
															style={{
																textAlign:
																	"center",
															}}
														>
															<Link
																to={`/movie/${movie._id}`}
															>
																{movie.title}
															</Link>
														</h1>

														<p
															style={{
																textAlign:
																	"left",
															}}
														>
															{movie.info.plot}
														</p>
													</Grid>
												</Grid>
												<Divider
													variant="fullWidth"
													style={{ margin: "15px 0" }}
												/>
											</React.Fragment>
										);
									})}
								</Paper>
							) : (
								<h2
									style={{
										textAlign: "center",
										display: "block",
										marginTop: "10%",
									}}
								>
									No movies found
								</h2>
							)}
						</div>
					)}
				</div>
			) : (
				<div className="loader">
					<div className="waterfall">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			)}
		</>
	);
};

export default Search;
