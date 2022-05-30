import React from "react";
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
import { Pencil, Trash, X } from "tabler-icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMovieList } from "../../actions/movies";
import "./MovieList.css";
import MovieListForm from "../movieListForm/MovieListForm";
import NotAuth from "../pages/notauth/NotAuth";
import { deleteReview } from "../../actions/auth";
import { Link } from "react-router-dom";
const jobColors = {
	completed: "green",
	ptw: "orange",
};

const MovieList = ({ movies }) => {
	const dispatch = useDispatch();
	const [editForm, setEditForm] = useState({
		isActive: false,
	});
	const deleteHandler = (deletion_id) => {
		const deletedList = movies.filter((m) => m.id !== deletion_id);
		dispatch(updateMovieList(deletedList));
		dispatch(deleteReview(deletion_id));
	};

	const EditForm = () => {
		const [status, setStatus] = useState();
		const [rating, setRating] = useState();
		const handleEditSubmit = () => {
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
						<Link to={`/movie/${item.id}`}>
							<Text size="xl" weight={500}>
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
						<Text size="xl" color="gray">
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

	return (
		<>
			<MovieListForm />
			<ScrollArea style={{ maxWidth: "45%", margin: "0 auto" }}>
				<Table verticalSpacing="sm">
					{rows.length >= 1 ? (
						<>
							<thead>
								<tr>
									<th>Title</th>
									<th>Status</th>
									<th>Rating</th>
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
