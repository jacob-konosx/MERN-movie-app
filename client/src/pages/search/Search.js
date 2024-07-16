import { Fragment, useEffect, useState } from "react";
import { Button, MultiSelect, NumberInput, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import {
	getDirectorsAndActors,
	searchAdvancedMovie,
} from "../../actions/movie";
import { Link } from "react-router-dom";
import { SET_ADVANCED_SEARCH_FIELD } from "../../constants/actionTypes";
import { Divider, Grid, Paper, TextField } from "@mui/material";
import _ from "lodash";
import Loader from "../../components/loader/Loader";

import "./Search.css";

const defaultQuery = { title: "", year: undefined };

const Search = () => {
	const dispatch = useDispatch();

	const [query, setQuery] = useState(defaultQuery);
	const [genres, setGenres] = useState([]);
	const [actors, setActors] = useState([]);
	const [directors, setDirectors] = useState([]);
	const [isQueryValid, setIsQueryValid] = useState(false);
	const [tempQuery, setTempQuery] = useState(null);

	const searchResults = useSelector(
		(state) => state.root.advancedSearchReducer?.searchResult
	);
	const queryData = useSelector(
		(state) => state.root.advancedSearchReducer?.queryData
	);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setQuery({ ...query, [name]: value });
	};

	useEffect(() => {
		dispatch(getDirectorsAndActors());
	}, [dispatch]);

	useEffect(() => {
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
	}, [query, genres, actors, directors, tempQuery]);

	const handleSearch = (e) => {
		e.preventDefault();
		const finishedQuery = { ...query, genres, actors, directors };

		if (isQueryValid) {
			dispatch(searchAdvancedMovie(finishedQuery));
			setTempQuery(finishedQuery);
		}
	};

	if (queryData) {
		return (
			<div className="searchMain">
				<h1>Advanced Search</h1>

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

				<div className="inputRow">
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
						onChange={(val) => setQuery({ ...query, year: val })}
					/>
				</div>

				<div className="inputRow">
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

				<div className="functionButtons">
					{isQueryValid && (
						<Text
							className="clearBtn"
							onClick={() => {
								setGenres([]);
								setDirectors([]);
								setActors([]);
								setTempQuery(null);
								setQuery(defaultQuery);
								dispatch({
									type: SET_ADVANCED_SEARCH_FIELD,
									payload: {
										field: "searchResult",
										data: null,
									},
								});
							}}
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
							<Paper className="resultPaper">
								{searchResults.data.map((movie) => (
									<Fragment key={movie._id}>
										<Grid
											className="resultGrid"
											container
											wrap="nowrap"
											key={movie._id}
										>
											<Grid item xs zeroMinWidth>
												<h1>
													<Link
														to={`/movie/${movie._id}`}
													>
														{movie.title}
													</Link>
												</h1>

												<p>{movie.info.plot}</p>
											</Grid>
										</Grid>
										<Divider variant="fullWidth" />
									</Fragment>
								))}
							</Paper>
						) : (
							<h2>No movies found</h2>
						)}
					</div>
				)}
			</div>
		);
	} else {
		<Loader />;
	}
};

export default Search;
