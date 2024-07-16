import {
	SET_MOVIE_REVIEW_USER_INFO,
	SET_MOVIE_REVIEWS,
	SET_MOVIE_FIELD,
} from "../constants/actionTypes";

const movieReducer = (state = { movies: null }, action) => {
	switch (action.type) {
		case SET_MOVIE_REVIEW_USER_INFO:
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
		case SET_MOVIE_REVIEWS:
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
