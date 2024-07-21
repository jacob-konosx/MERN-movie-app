import { ActionIcon } from "@mantine/core";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash, X } from "tabler-icons-react";
import {
	getMoviesById,
	updateReviewText,
	deleteReview,
} from "../../actions/movie";
import { Link } from "react-router-dom";
import { Divider, Grid, Paper, TextField } from "@mui/material";
import AlertMessage from "../../pages/alertMessage/AlertMessage";
import { timeAgo } from "../../lib/timeago";

import "./UserReviewList.css";

const ReviewList = ({ user }) => {
	const { reviewList } = user;

	const dispatch = useDispatch();
	const [editingId, setEditingId] = useState(null);
	const [reviewText, setReviewText] = useState(null);

	const reviewedMovies = useSelector(
		(state) => state.root.movieReducer.reviewedMovies
	);

	useEffect(() => {
		dispatch(getMoviesById(reviewList));
	}, [dispatch, reviewList]);

	const editHandler = (movieId) => {
		if (reviewText.length > 0) {
			dispatch(updateReviewText(movieId, reviewText));
			setReviewText(null);
			setEditingId(null);
			dispatch(getMoviesById(reviewList));
		}
	};

	if (reviewList.length === 0) {
		return (
			<AlertMessage
				alert={{
					text: "No reviews found",
					description:
						"Reviews can be added to movies from the homepage.",
				}}
				button={{ text: "Take me home", path: "" }}
			/>
		);
	}

	return (
		<div className="userReviews">
			<Paper className="userReviewsPaper">
				{reviewedMovies.map((movie) => {
					const review = movie.reviews.find((obj) => {
						return obj.uid === user._id;
					});

					const date = timeAgo.format(Date.parse(review.createdAt));

					return (
						<Fragment key={movie._id}>
							<Grid
								container
								wrap="nowrap"
								className="userReviewsGrid"
							>
								<Grid item xs zeroMinWidth>
									<h3>
										<Link to={`/movie/${movie._id}`}>
											{movie.title}
										</Link>
										{` - ${movie.year}`}
									</h3>

									{!editingId && (
										<ActionIcon
											color="blue"
											onClick={() => {
												setEditingId(review._id);
												setReviewText(review.text);
											}}
										>
											<Edit size={16} />
										</ActionIcon>
									)}

									<ActionIcon
										color="red"
										onClick={() =>
											dispatch(deleteReview(movie._id))
										}
									>
										<Trash size={16} />
									</ActionIcon>

									<p className="userReviewDate">{date}</p>

									{editingId === review._id ? (
										<>
											<TextField
												className="userReviewInput"
												placeholder="My review (1720 Character Limit)..."
												multiline
												fullWidth
												minRows={4}
												maxRows={12}
												variant="filled"
												inputProps={{
													maxLength: 1721,
												}}
												value={reviewText}
												onChange={(e) =>
													setReviewText(
														e.target.value
													)
												}
											/>

											<div className="editing">
												<ActionIcon
													color="green"
													onClick={() =>
														editHandler(movie._id)
													}
												>
													<Edit size={16} />
												</ActionIcon>
												<ActionIcon
													color="red"
													onClick={() => {
														setEditingId(null);
														setReviewText(null);
													}}
												>
													<X size={16} />
												</ActionIcon>
											</div>
										</>
									) : (
										<p>{review.text}</p>
									)}
								</Grid>
							</Grid>
							<Divider
								variant="fullWidth"
								className="userReviewDivider"
							/>
						</Fragment>
					);
				})}
			</Paper>
		</div>
	);
};

export default ReviewList;
