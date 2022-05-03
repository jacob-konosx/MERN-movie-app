import React, { useState } from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
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

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const Review = ({ id }) => {
	const dispatch = useDispatch();

	const [reviewText, setReviewText] = useState("");
	const reviews = useSelector((state) => state.root.movieReducer?.reviews);
	const user = useSelector((state) => state.root.authReducer?.profile);

	const handleReviewSubmit = () => {
		if (reviewText.length >= 1) {
			dispatch(
				addReview(id, {
					uid: user.result._id,
					text: reviewText,
				})
			);
			dispatch(
				addUserReviewList(user.result._id, {
					movieId: id,
				})
			);
			setReviewText("");
		}
	};
	return (
		<div className="reviews">
			<h1 style={{ textAlign: "center" }}>Reviews</h1>
			{user ? (
				<>
					{!user.result.reviewList.some((e) => e.movieId === id) ? (
						<>
							<TextField
								style={{ marginBottom: "1%" }}
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
								onChange={(e) => setReviewText(e.target.value)}
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
						<h2 style={{ textAlign: "center" }}>
							You have already written a review.
						</h2>
					)}
				</>
			) : (
				<h2 style={{ textAlign: "center" }}>Login to add a review.</h2>
			)}
			{reviews && reviews.length >= 1 ? (
				<div className="userReviews">
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
					<h3 style={{ textAlign: "center" }}>No Reviews...</h3>
				</div>
			)}
		</div>
	);
};

export default Review;
