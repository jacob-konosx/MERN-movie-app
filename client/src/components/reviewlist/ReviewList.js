import { ActionIcon, Center } from "@mantine/core";
import { Divider, Grid, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash } from "tabler-icons-react";
import { deleteReview } from "../../actions/auth";
import { getMoviesById } from "../../actions/movies";
import { timeAgo } from "../timeago/timeago";
import "./ReviewList.css";
const ReviewList = ({ userReviews }) => {
	const dispatch = useDispatch();
	const movies = useSelector((state) => state.root.movieReducer);
	const user = useSelector((state) => state.root.authReducer.profile.result);

	useEffect(() => {
		dispatch(getMoviesById(userReviews));
	}, []);
	if ((userReviews && userReviews.length === 0) || !userReviews) {
		return <h3 className="no_reviews">No reviews found...</h3>;
	}

	const deleteHandler = (movieId) => {
		dispatch(deleteReview(user._id, movieId));
	};
	return (
		<div className="userReviews">
			<Paper
				style={{
					padding: "0px 20px",
					paddingTop: "40px",
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
									spacing={2}
								>
									<Grid item xs zeroMinWidth>
										<h4
											style={{
												margin: 0,
												textAlign: "left",
											}}
										>
											<a href={`/movie/${movie._id}`}>
												{movie.title}
											</a>
											{`- ${movie.year}`}
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
										<ActionIcon
											color="red"
											onClick={() =>
												deleteHandler(movie._id)
											}
										>
											<Trash size={16} />
										</ActionIcon>
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
	);
};

export default ReviewList;
