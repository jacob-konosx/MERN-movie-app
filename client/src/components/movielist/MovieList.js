import React, { useEffect } from "react";
import {
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	ScrollArea,
	NumberInput,
	Select,
} from "@mantine/core";
import {
	ArrowDown,
	ArrowUp,
	Pencil,
	Trash,
	Writing,
	X,
} from "tabler-icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMovieList } from "../../actions/movies";
import "./MovieList.css";
import MovieListForm from "../movieListForm/MovieListForm";
import NotAuth from "../pages/notauth/NotAuth";
import { deleteReview } from "../../actions/auth";
import { Link } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { SET_USER_FIELD } from "../../constants/actionTypes";

const jobColors = {
	completed: "green",
	ptw: "orange",
};

const MovieList = ({ movies }) => {
	const user = useSelector((state) => state.root.authReducer.profile);
	const dispatch = useDispatch();
	const [editForm, setEditForm] = useState({
		isActive: false,
	});
	const [sort, setSort] = useState({
		type: null,
		mode: null,
	});

	const deleteHandler = (deletion_id) => {
		const deletedList = movies.filter((m) => m.id !== deletion_id);
		dispatch(updateMovieList(deletedList));
		dispatch(deleteReview(deletion_id));
	};

	const EditForm = () => {
		const [status, setStatus] = useState();
		const [rating, setRating] = useState();
		const confirmReview = () => {
			confirmAlert({
				title: "Confirm to update",
				message:
					'You are trying to update the status of a movie you have reviewed. Reviews can only exist for "Completed" movies. In doing this update the review will also be deleted. Continue with the update?',
				buttons: [
					{
						label: "Yes",
						onClick: () => {
							dispatch(deleteReview(editForm.id));
							updateList();
						},
					},
					{
						label: "No",
						onClick: () => {
							setEditForm({
								isActive: false,
							});
						},
					},
				],
			});
		};

		const handleEditSubmit = () => {
			if (
				user.reviewList.some((m) => m.movieId === editForm.id) &&
				status === "Plan to Watch"
			) {
				confirmReview();
				return;
			}
			updateList();
		};

		const updateList = () => {
			const finalRating = rating || editForm.rating;
			const finalStatus = status || editForm.status;
			const finalForm = { ...editForm, rating: finalRating };
			delete finalForm?.isActive;
			const oldMovies = movies.filter((m) => m.id !== editForm.id);
			dispatch(
				updateMovieList([
					...oldMovies,
					{ ...finalForm, status: finalStatus },
				])
			);
			setEditForm({ isActive: false });
		};
		return (
			<div className="editForm">
				<NumberInput
					name="rating"
					required={true}
					label="Rating"
					min={1}
					max={10}
					step={0.1}
					precision={1}
					value={rating || editForm.rating}
					onChange={(val) => setRating(val)}
				/>
				<Select
					required={true}
					value={status || editForm.status}
					label="Movie Status"
					placeholder="Choose movie status"
					data={[
						{ value: "Plan to Watch", label: "Plan to Watch" },
						{ value: "Completed", label: "Completed" },
					]}
					onChange={setStatus}
				/>
				<ActionIcon
					className="editButton"
					variant="outline"
					color="green"
					onClick={handleEditSubmit}
				>
					<Pencil size={16} />
				</ActionIcon>
			</div>
		);
	};
	const rows = movies.map((item) => {
		return (
			<React.Fragment key={item.id}>
				<tr>
					<td>
						{user.reviewList.some((m) => m.movieId === item.id) && (
							<div className="reviewIcon">
								<Writing label="Reviewed" size={16} />
							</div>
						)}

						<Link to={`/movie/${item.id}`}>
							<Text
								className="movieListText"
								size="xl"
								weight={500}
							>
								{item.title}
							</Text>
						</Link>
					</td>

					<td>
						<Badge
							color={jobColors[item.status.toLowerCase()]}
							variant="outline"
						>
							{item.status}
						</Badge>
					</td>
					<td>
						<Text className="movieListText" size="xl" color="gray">
							{item.rating}/10
						</Text>
					</td>
					<td>
						<Group spacing={0} position="right">
							{editForm.isActive === false && (
								<ActionIcon
									color="blue"
									onClick={() =>
										setEditForm({
											isActive: !editForm.isActive,
											...item,
										})
									}
								>
									<Pencil size={16} />
								</ActionIcon>
							)}
							{editForm.isActive === true &&
								editForm.id === item.id && (
									<ActionIcon
										color="red"
										onClick={() =>
											setEditForm({
												isActive: false,
											})
										}
									>
										<X size={16} />
									</ActionIcon>
								)}
							<ActionIcon
								color="red"
								onClick={() => deleteHandler(item.id)}
							>
								<Trash size={16} />
							</ActionIcon>
						</Group>
					</td>
				</tr>
				{editForm.isActive && editForm.id === item.id && <EditForm />}
			</React.Fragment>
		);
	});
	useEffect(() => {
		sortMovies();
	}, [sort]);
	const sortMovies = () => {
		const movieList = [...movies].sort((a, b) =>
			sort.mode === "ascending"
				? a[sort.type] > b[sort.type]
					? 1
					: -1
				: a[sort.type] < b[sort.type]
				? 1
				: -1
		);

		dispatch({
			type: SET_USER_FIELD,
			payload: { field: "moviesList", data: movieList },
		});
	};
	const handleSort = (e) => {
		sort.type === e.target.getAttribute("name")
			? setSort({
					...sort,
					mode:
						sort.mode === "descending" ? "ascending" : "descending",
			  })
			: setSort({
					type: e.target.getAttribute("name"),
					mode: "descending",
			  });
	};
	const SortDisplay = ({ type }) => {
		return (
			<>
				{sort.type === type ? (
					sort.mode === "descending" ? (
						<div className="sort">
							<ArrowDown />
						</div>
					) : (
						<div className="sort">
							<ArrowUp />
						</div>
					)
				) : (
					<></>
				)}
			</>
		);
	};
	return (
		<>
			<MovieListForm />
			<ScrollArea className="movieListArea">
				<Table verticalSpacing="sm">
					{rows.length >= 1 ? (
						<>
							<thead align="center">
								<tr>
									<th>
										<p name="title" onClick={handleSort}>
											Title
										</p>
										<SortDisplay type="title" />
									</th>

									<th>
										<p name="status" onClick={handleSort}>
											Status
										</p>
										<SortDisplay type="status" />
									</th>

									<th>
										<p name="rating" onClick={handleSort}>
											Rating
										</p>
										<SortDisplay type="rating" />
									</th>
									<th />
								</tr>
							</thead>
							<tbody>{rows}</tbody>
						</>
					) : (
						<NotAuth
							error={{
								text: "No movies in list",
								description:
									"You can add movies to your list from the forum above or browse all movies from the homepage.",
							}}
							button={{ text: "Take me home", path: "" }}
						/>
					)}
				</Table>
			</ScrollArea>
		</>
	);
};

export default MovieList;
