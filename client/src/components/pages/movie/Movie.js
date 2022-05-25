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
	const movie = useSelector((state) => state.root.movieReducer);

	useEffect(() => {
		const fetchData = async () => {
			await dispatch(getMovie(id));
			await dispatch(getMoviesAverage(id));
		};
		fetchData().catch(console.error);
	}, [id]);
	if (!movie || movie.message) {
		return (
			<NotAuth
				error={{
					text: "Movie Not Found",
					description:
						"The movie ID you have entered does not correspond to an existing movie.",
				}}
				button={{ text: "Take me to the homepage", path: "" }}
			/>
		);
	}
	return (
		<div className="singleMovie">
			{movie.info && movie.average_rating && (
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
			)}
			{movie.info && <Review id={movie._id} />}
		</div>
	);
};

export default Movie;
