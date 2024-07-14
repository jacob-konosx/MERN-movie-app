import {
	FETCH_ALL,
	QUERY_MOVIE,
	CLEAR_SEARCH,
	SET_USER_MOVIE_REVIEW,
	SET_REVIEWS,
	SET_MOVIE_FIELD,
} from "../constants/actionTypes";

const movieReducer = (state = { movies: null }, action) => {
	switch (action.type) {
		case FETCH_ALL:
			return { ...state, movies: action.payload };
		case QUERY_MOVIE:
			return { ...state, searchRes: action.payload };
		case CLEAR_SEARCH:
			return { ...state, searchRes: [] };
		case SET_USER_MOVIE_REVIEW:
			const reviewList = state.singleMovie.reviews.map((review) => {
				if (review._id === action.payload.review_id) {
					return { ...review, userData: action.payload.data };
				}
				return review;
			});

			return {
				...state,
				singleMovie: { ...state.singleMovie, reviews: reviewList },
			};
		case SET_REVIEWS:
			return {
				...state,
				singleMovie: {
					...state.singleMovie,
					reviews: action.payload.data,
				},
			};
		case SET_MOVIE_FIELD:
			return {
				...state,
				[action.payload.field]: action.payload.data,
			};
		default:
			return state;
	}
};

export default movieReducer;
