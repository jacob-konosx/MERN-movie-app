import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addReview, getUserInfo } from "../../../../actions/movies";
import {
	Avatar,
	Button,
	Divider,
	Grid,
	Paper,
	TextField,
} from "@material-ui/core";
import "./Review.css";
import { addUserReviewList } from "../../../../actions/auth";
import { timeAgo } from "../../../timeago/timeago";
import NotAuth from "../../notauth/NotAuth";
import { Badge } from "@mantine/core";

const Review = ({ id }) => {
	const dispatch = useDispatch();

	const [reviewText, setReviewText] = useState("");
	const reviews = useSelector(
		(state) => state.root.movieReducer.singleMovie?.reviews
	);
	const user = useSelector((state) => state.root.authReducer?.profile);

	const handleReviewSubmit = () => {
		if (reviewText.length >= 1) {
			dispatch(
				addReview(id, {
					uid: user._id,
					text: reviewText,
				})
			);
			dispatch(
				addUserReviewList({
					movieId: id,
				})
			);
			setReviewText("");
		}
	};
	return (
		<div className="reviews">
			{user ? (
				<>
					{!user.reviewList.some((e) => e.movieId === id) ? (
						<>
							{user.moviesList.some(
								(e) => e.id === id && e.status === "Completed"
							) ? (
								<>
									<TextField
										style={{ margin: "1% 0px" }}
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
											setReviewText(e.target.value)
										}
									/>
									<Button
										style={{ marginBottom: "4%" }}
										variant="outlined"
										onClick={handleReviewSubmit}
									>
										Add review
									</Button>
								</>
							) : (
								<NotAuth
									error={{
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
						<h2 style={{ textAlign: "center" }}>
							You have already written a review.
						</h2>
					)}
				</>
			) : (
				<NotAuth
					error={{
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
			<h1
				style={{
					textAlign: "center",
					fontSize: "50px",
					marginTop: "0px",
				}}
			>
				Reviews
			</h1>
			{reviews && reviews.length >= 1 ? (
				<div className="movieReviews">
					<Paper style={{ padding: "0px 20px", paddingTop: "40px" }}>
						{reviews.map((review) => {
							const date = timeAgo.format(
								Date.parse(review.createdAt)
							);
							if (!review.userData) {
								dispatch(getUserInfo(review.uid, review._id));
								return (
									<React.Fragment
										key={review._id}
									></React.Fragment>
								);
							}

							return (
								<React.Fragment key={review._id}>
									<Grid
										style={{ marginBottom: "0px" }}
										container
										wrap="nowrap"
										spacing={2}
									>
										<Badge size="lg" className="userRating">
											{
												review.userData.moviesList.find(
													(e) => e.id === id
												).rating
											}
										</Badge>
										<Grid item>
											<Avatar
												alt={review.userData.name}
												src={review.userData.imageUrl}
											/>
										</Grid>
										<Grid item xs zeroMinWidth>
											<h4
												style={{
													margin: 0,
													textAlign: "left",
												}}
											>
												{review.userData.name}
											</h4>
											<p
												style={{
													fontSize: "14px",
													margin: "0px",
													textAlign: "left",
													color: "gray",
												}}
											>
												{date}
											</p>
											<p
												style={{
													textAlign: "left",
												}}
											>
												{review.text}
											</p>
										</Grid>
									</Grid>
									<Divider
										variant="fullWidth"
										style={{ margin: "30px 0" }}
									/>
								</React.Fragment>
							);
						})}
					</Paper>
				</div>
			) : (
				<div>
					<h2 style={{ textAlign: "center" }}>No Reviews Found...</h2>
				</div>
			)}
		</div>
	);
};

export default Review;
