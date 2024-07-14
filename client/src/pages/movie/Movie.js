import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovie } from "../../actions/movie";
import Review from "./Review/Review";
import AlertMessage from "../alertMessage/AlertMessage";
import BadgeCard from "../../components/movieCard/MovieCard";

import "./Movie.css";
import { CLEAR_ERROR } from "../../constants/actionTypes";

const Movie = () => {
	const { id } = useParams();
	const dispatch = useDispatch();

	const movie = useSelector((state) => state.root.movieReducer?.singleMovie);
	const getMovieError = useSelector(
		(state) => state.root.errorReducer?.getMovieError
	);

	useEffect(() => {
		dispatch({ type: CLEAR_ERROR });
		dispatch(getMovie(id));
	}, [id, dispatch]);

	if (getMovieError === 404) {
		return (
			<div>
				<AlertMessage
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
			</div>
		);
	}

	return (
		<div className="singleMovie">
			{movie._id === id ? (
				<>
					<BadgeCard
						props={{
							mode: "big",
							...movie,
						}}
					/>
					<Review movieId={movie._id} />
				</>
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
		</div>
	);
};

export default Movie;
