import { ActionIcon } from "@mantine/core";
import { Divider, Grid, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "tabler-icons-react";
import { deleteReview } from "../../actions/auth";
import { getMoviesById } from "../../actions/movies";
import { timeAgo } from "../timeago/timeago";
import { Link } from "react-router-dom";

import "./ReviewList.css";
import NotAuth from "../pages/notauth/NotAuth";
const ReviewList = ({ userReviews }) => {
	const dispatch = useDispatch();
	const movies = useSelector((state) => state.root.movieReducer);
	const user = useSelector((state) => state.root.authReducer.profile);

	useEffect(() => {
		dispatch(getMoviesById(userReviews));
	}, [user]);
	if ((userReviews && userReviews.length === 0) || !userReviews) {
		return (
			<NotAuth
				error={{
					text: "No reviews found",
					description:
						"Reviews can be added to movies from the homepage.",
				}}
				button={{ text: "Take me home", path: "" }}
			/>
		);
	}

	const deleteHandler = (movieId) => {
		dispatch(deleteReview(movieId));
	};
	return (
		<div className="userReviews">
			<Paper
				style={{
					padding: "0px 20px",
					paddingTop: "20px",
				}}
			>
				{movies.constructor === Array &&
					movies.map((movie) => {
						const review = movie.reviews.find((obj) => {
							return obj.uid === user._id;
						});
						const date = timeAgo.format(
							Date.parse(review.createdAt)
						);
						return (
							<React.Fragment key={movie._id}>
								<Grid
									style={{ marginBottom: "0px" }}
									container
									wrap="nowrap"
								>
									<Grid item xs zeroMinWidth>
										<h3
											style={{
												margin: 0,
												textAlign: "left",
											}}
										>
											<Link to={`/movie/${movie._id}`}>
												{movie.title}
											</Link>
											{` - ${movie.year}`}
										</h3>

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
										<ActionIcon
											color="red"
											onClick={() =>
												deleteHandler(movie._id)
											}
										>
											<Trash size={16} />
										</ActionIcon>
									</Grid>
								</Grid>
								<Divider
									variant="fullWidth"
									style={{ margin: "15px 0" }}
								/>
							</React.Fragment>
						);
					})}
			</Paper>
		</div>
	);
};

export default ReviewList;
