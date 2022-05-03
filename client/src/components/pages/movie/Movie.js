import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BadgeCard from "../../badgecard/BadgeCard";
import { getMovie } from "../../../actions/movies";

import "./Movie.css";
import Review from "./Review/Review";
const Movie = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const movie = useSelector((state) => state.root.movieReducer);

	useEffect(() => {
		dispatch(getMovie(id));
	}, [id]);

	return (
		<div className="singleMovie">
			{movie.info && (
				<BadgeCard
					props={{
						mode: "big",
						title: movie.title,
						info: movie.info,
						year: movie.year,
						_id: movie._id,
					}}
				/>
			)}
			<Review id={movie._id} />
		</div>
	);
};

export default Movie;
