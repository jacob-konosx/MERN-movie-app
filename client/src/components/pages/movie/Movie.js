import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BadgeCard from "../../badgecard/BadgeCard";
import { getMovie, getMoviesAverage } from "../../../actions/movies";

import "./Movie.css";
import Review from "./Review/Review";
import NotAuth from "../notauth/NotAuth";
const Movie = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const movie = useSelector((state) => state.root.movieReducer?.singleMovie);

	useEffect(() => {
		dispatch(getMovie(id));
	}, [id]);

	return (
		<div className="singleMovie">
			{movie?._id && movie._id === id ? (
				<>
					<BadgeCard
						props={{
							mode: "big",
							title: movie.title,
							info: movie.info,
							year: movie.year,
							_id: movie._id,
							average_rating: movie.average_rating,
						}}
					/>
					<Review id={movie._id} />
				</>
			) : (
				<>
					{movie?.movieNotFound === id ? (
						<div style={{ marginTop: "10%" }}>
							<NotAuth
								error={{
									text: "Movie Not Found",
									description:
										"The movie ID you have entered does not correspond to an existing movie.",
								}}
								button={{
									text: "Take me to the homepage",
									path: "",
								}}
							/>
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
			)}
		</div>
	);
};

export default Movie;
