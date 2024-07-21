import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovie } from "../../actions/movie";
import Review from "./Review/Review";
import AlertMessage from "../alertMessage/AlertMessage";
import BadgeCard from "../../components/movieCard/MovieCard";
import Loader from "../../components/loader/Loader";

import "./Movie.css";

const Movie = () => {
	const { id } = useParams();
	const dispatch = useDispatch();

	const movie = useSelector((state) => state.root.movieReducer?.singleMovie);
	const getMovieError = useSelector(
		(state) => state.root.errorReducer?.getMovieError
	);

	useEffect(() => {
		dispatch(getMovie(id));
	}, [id, dispatch]);

	if (getMovieError === 404) {
		return (
			<AlertMessage
				source="soloPage"
				alert={{
					text: "Movie Not Found",
					description:
						"The movie ID you have entered does not correspond to an existing movie.",
				}}
				button={{
					text: "Take me to the homepage",
					path: "",
				}}
			/>
		);
	}

	if (!movie || movie._id !== id) {
		return <Loader />;
	}

	return (
		<div className="singleMovie">
			<BadgeCard
				props={{
					mode: "big",
					...movie,
				}}
			/>
			<Review movieId={movie._id} />
		</div>
	);
};

export default Movie;
