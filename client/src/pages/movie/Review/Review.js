import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getUserInfoAndSetToReview } from "../../../actions/movie";
import { Badge } from "@mantine/core";
import { Avatar, Button, Divider, Grid, Paper, TextField } from "@mui/material";
import { timeAgo } from "../../../lib/timeago";
import AlertMessage from "../../alertMessage/AlertMessage";

import "./Review.css";

const Review = ({ movieId }) => {
	const dispatch = useDispatch();

	const [reviewText, setReviewText] = useState("");

	const reviews = useSelector(
		(state) => state.root.movieReducer.singleMovie?.reviews
	);
	const user = useSelector((state) => state.root.userReducer?.profile);

	const isValidReview = reviewText.length > 0;

	const submitReview = () => {
		if (isValidReview) {
			dispatch(
				addReview(movieId, {
					uid: user._id,
					text: reviewText,
				})
			);
		}
	};

	return (
		<div className="reviews">
			<h1>Reviews</h1>

			{user ? (
				<>
					{!user.reviewList.some((e) => e.movieId === movieId) ? (
						<>
							{user.moviesList.some(
								(e) =>
									e.id === movieId && e.status === "Completed"
							) ? (
								<>
									<TextField
										className="reviewInput"
										placeholder="My review..."
										multiline
										fullWidth
										minRows={4}
										maxRows={12}
										variant="filled"
										inputProps={{
											maxLength: 1700,
										}}
										value={reviewText}
										onChange={(e) =>
											setReviewText(e.target.value)
										}
									/>

									<Button
										variant="outlined"
										color="primary"
										onClick={submitReview}
										disabled={!isValidReview}
									>
										Add review
									</Button>

									<p className="reviewCounter">
										{reviewText.length}/1700
									</p>
								</>
							) : (
								<AlertMessage
									alert={{
										text: "Movie Required In List",
										description:
											"To write a review for a movie you first need to add the movie to your movie list (With status - Completed). This can be done from the account page by clicking the cross button in the movies list tab.",
									}}
									button={{
										text: "Take me to account page",
										path: "account",
									}}
								/>
							)}
						</>
					) : (
						<h4 className="userReviewStatus">
							You have already written a review
						</h4>
					)}
				</>
			) : (
				<AlertMessage
					alert={{
						text: "Login To Add a Review",
						description:
							"To write a review for a movie you first need to be logged in.",
					}}
					button={{
						text: "Take me to login page",
						path: "auth",
					}}
				/>
			)}

			{reviews && reviews.length > 0 ? (
				<div className="movieReviews">
					<Paper className="reviewPaper">
						{reviews.map((review) => {
							const date = timeAgo.format(
								Date.parse(review.createdAt)
							);
							if (!review.userData) {
								dispatch(
									getUserInfoAndSetToReview(
										review.uid,
										review._id
									)
								);
								return <Fragment key={review._id}></Fragment>;
							}

							return (
								<Fragment key={review._id}>
									<Grid
										container
										wrap="nowrap"
										spacing={2}
										className="reviewGrid"
									>
										<Badge size="lg" className="userRating">
											{
												review.userData.moviesList.find(
													(e) => e.id === movieId
												).rating
											}
										</Badge>
										<Grid item>
											<Avatar
												alt={review.userData.name}
												src={review.userData.imageUrl}
											/>
										</Grid>
										<Grid
											item
											xs
											zeroMinWidth
											className="reviewInfo"
										>
											<h4>{review.userData.name}</h4>
											<p className="reviewDate">{date}</p>
											<p>{review.text}</p>
										</Grid>
									</Grid>
									<Divider
										variant="fullWidth"
										className="reviewDivider"
									/>
								</Fragment>
							);
						})}
					</Paper>
				</div>
			) : (
				<h2>No Reviews Found</h2>
			)}
		</div>
	);
};

export default Review;
