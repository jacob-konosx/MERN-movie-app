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

const defaultQuery = {
	title: "",
	year: undefined,
	genres: [],
	actors: [],
	directors: [],
};

const Search = () => {
	const dispatch = useDispatch();

	const [query, setQuery] = useState(defaultQuery);
	const [previousQuery, setPreviousQuery] = useState(null);

	const searchResult = useSelector(
		(state) => state.root.advancedSearchReducer?.searchResult
	);
	const queryData = useSelector(
		(state) => state.root.advancedSearchReducer?.queryData
	);

	const isQueryValid =
		(query.title !== "" ||
			query.year ||
			query.genres.length > 0 ||
			query.actors.length > 0 ||
			query.directors.length > 0) &&
		!_.isEqual(previousQuery, { ...query });

	useEffect(() => {
		dispatch(getDirectorsAndActors());
	}, [dispatch]);

	const handleSearch = (e) => {
		e.preventDefault();

		if (isQueryValid) {
			dispatch(searchAdvancedMovie(query));
			setPreviousQuery(query);
		}
	};

	if (!queryData) {
		return <Loader />;
	}

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
				onChange={(e) => setQuery({ ...query, title: e.target.value })}
			/>

			<div className="inputRow">
				<MultiSelect
					className="searchGenres"
					onChange={(val) => setQuery({ ...query, genres: val })}
					name="genres"
					searchable
					data={queryData.genres}
					placeholder="Choose Genres"
					label="Genres"
					value={query.genres}
				/>
				<NumberInput
					className="searchYear"
					label="Year"
					value={query.year}
					max={new Date().getFullYear()}
					step={1}
					onChange={(val) => setQuery({ ...query, year: val })}
					name="year"
				/>
			</div>

			<div className="inputRow">
				<MultiSelect
					limit={200}
					className="searchGenres"
					onChange={(val) => setQuery({ ...query, actors: val })}
					name="actors"
					searchable
					data={queryData.actors}
					placeholder="Searching displays more actors"
					label="Actors"
					value={query.actors}
				/>
				<MultiSelect
					limit={200}
					className="searchYear"
					onChange={(val) => setQuery({ ...query, directors: val })}
					name="directors"
					searchable
					data={queryData.directors}
					placeholder="Searching displays more directors"
					label="Directors"
					value={query.directors}
				/>
			</div>

			<div className="functionButtons">
				{isQueryValid && (
					<Text
						className="clearBtn"
						onClick={() => {
							setPreviousQuery(null);
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

			<div>
				{searchResult.length > 0 ? (
					<Paper className="resultPaper">
						{searchResult.map((movie) => (
							<Fragment key={movie._id}>
								<Grid
									className="resultGrid"
									container
									wrap="nowrap"
									key={movie._id}
								>
									<Grid item xs zeroMinWidth>
										<h1>
											<Link to={`/movie/${movie._id}`}>
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
		</div>
	);
};

export default Search;
