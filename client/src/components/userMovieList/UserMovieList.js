import { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { updateMovieList } from "../../actions/movie";
import { deleteReview } from "../../actions/movie";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import UserMovieListForm from "../userMovieListForm/UserMovieListForm";
import AlertMessage from "../../pages/alertMessage/AlertMessage";

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./UserMovieList.css";

const movieColors = {
	completed: "green",
	ptw: "orange",
};

const UserMovieList = ({ user }) => {
	const { moviesList, reviewList } = user;

	const dispatch = useDispatch();

	const [editForm, setEditForm] = useState({
		isActive: false,
	});
	const [sort, setSort] = useState({
		type: null,
		mode: null,
	});
	const [sortedMoviesList, setSortedMoviesList] = useState(moviesList);

	useEffect(() => {
		const sortedMovieList = [...moviesList].sort((a, b) =>
			sort.mode === "ascending"
				? a[sort.type] > b[sort.type]
					? 1
					: -1
				: a[sort.type] < b[sort.type]
				? 1
				: -1
		);
		setSortedMoviesList(sortedMovieList);
	}, [sort, dispatch, moviesList]);

	const deleteMovieHandler = (movieId) => {
		const deletedList = sortedMoviesList.filter((m) => m.id !== movieId);
		dispatch(updateMovieList(deletedList));
		dispatch(deleteReview(movieId));
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
				reviewList.some((m) => m.movieId === editForm.id) &&
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
			const oldMovies = sortedMoviesList.filter(
				(m) => m.id !== editForm.id
			);
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
				<h2>
					Update {editForm.title}
				</h2>
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

	const rows = sortedMoviesList.map((movie) => (
		<tr key={movie.id}>
			<td>
				{reviewList.some((m) => m.movieId === movie.id) && (
					<div className="reviewIcon">
						<Writing label="Reviewed" size={16} />
					</div>
				)}

				<Link to={`/movie/${movie.id}`}>
					<Text className="movieListText" size="xl" weight={500}>
						{movie.title}
					</Text>
				</Link>
			</td>

			<td>
				<Badge
					color={movieColors[movie.status.toLowerCase()]}
					variant="outline"
				>
					{movie.status}
				</Badge>
			</td>

			<td>
				<Text className="movieListText" size="xl" color="gray">
					{movie.rating}/10
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
									...movie,
								})
							}
						>
							<Pencil size={16} />
						</ActionIcon>
					)}

					{editForm.isActive === true && editForm.id === movie.id && (
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
						onClick={() => deleteMovieHandler(movie.id)}
					>
						<Trash size={16} />
					</ActionIcon>
				</Group>
			</td>
		</tr>
	));

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
		if (sort.type === type) {
			if (sort.mode === "descending") {
				return (
					<div className="sort">
						<ArrowDown />
					</div>
				);
			}
			return (
				<div className="sort">
					<ArrowUp />
				</div>
			);
		}
	};

	return (
		<div className="movieList">
			{editForm.isActive && <EditForm />}

			<UserMovieListForm moviesList={moviesList} />

			<ScrollArea className="movieListArea">
				<Table>
					{rows.length > 0 ? (
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
						<AlertMessage
							alert={{
								text: "No movies in list",
								description:
									"You can add movies to your list from the forum above or browse all movies from the homepage.",
							}}
							button={{ text: "Take me home", path: "" }}
						/>
					)}
				</Table>
			</ScrollArea>
		</div>
	);
};

export default UserMovieList;
