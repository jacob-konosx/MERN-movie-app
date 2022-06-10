import {
	FETCH_ALL,
	SEARCH,
	CLEAR_SEARCH,
	SET_MOVIE_REVIEW_USER,
	SET_REVIEWS,
	SET_MOVIE_AVERAGE,
	SET_MOVIE_FIELD,
} from "../constants/actionTypes";

const movieReducer = (movies = [], action) => {
	switch (action.type) {
		case FETCH_ALL:
			return action.payload;
		case SEARCH:
			return { ...movies, searchRes: action.payload };
		case CLEAR_SEARCH:
			return { ...movies, searchRes: [] };
		case SET_MOVIE_REVIEW_USER:
			const reviewList = movies.singleMovie.reviews.map((rev) =>
				rev._id === action.payload.review_id
					? { ...rev, userData: action.payload.data }
					: rev
			);
			return {
				...movies,
				singleMovie: { ...movies.singleMovie, reviews: reviewList },
			};
		case SET_REVIEWS:
			return {
				...movies,
				singleMovie: {
					...movies.singleMovie,
					reviews: action.payload.data,
				},
			};
		case SET_MOVIE_AVERAGE:
			return {
				...movies,
				singleMovie: {
					...movies.singleMovie,
					average_rating: action.payload,
				},
			};
		case SET_MOVIE_FIELD:
			return {
				...movies,
				[action.payload.field]: action.payload.data,
			};
		default:
			return movies;
	}
};
export default movieReducer;
