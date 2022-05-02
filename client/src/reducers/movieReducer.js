import {
	FETCH_ALL,
	FETCH_ONE,
	SEARCH,
	CLEAR_SEARCH,
	SET_MOVIE_REVIEW_USER,
	SET_REVIEWS,
} from "../constants/actionTypes";

const movieReducer = (movies = [], action) => {
	switch (action.type) {
		case FETCH_ALL:
			return action.payload;
		case FETCH_ONE:
			return action.payload;
		case SEARCH:
			return { ...movies, searchRes: action.payload };
		case CLEAR_SEARCH:
			return { ...movies, searchRes: [] };
		case SET_MOVIE_REVIEW_USER:
			const reviewList = movies.reviews.map((rev) =>
				rev._id === action.payload.review_id
					? { ...rev, userData: action.payload.data }
					: rev
			);
			return { ...movies, reviews: reviewList };
		case SET_REVIEWS:
			return {
				...movies,
				reviews: action.payload.data,
			};
		default:
			return movies;
	}
};
export default movieReducer;
