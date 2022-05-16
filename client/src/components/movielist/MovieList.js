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
	Button,
} from "@mantine/core";
import { Pencil, Trash } from "tabler-icons-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMovieList } from "../../actions/movies";
import "./MovieList.css";
import MovieListForm from "../movieListForm/MovieListForm";
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
		const deletedList = movies.filter((m) => m._id !== deletion_id);
		dispatch(updateMovieList(deletedList));
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
					style={{
						position: "relative",
						width: "60%",
						padding: "2%",
					}}
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
					style={{ width: "60%" }}
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
				<Button style={{ left: "50%" }} onClick={handleEditSubmit}>
					Update
				</Button>
			</div>
		);
	};
	const rows = movies.map((item) => {
		return (
			<React.Fragment key={item.id}>
				<tr>
					<td>
						<Group spacing="sm">
							<Text size="xl" weight={500}>
								{item.title}
							</Text>
						</Group>
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
							<ActionIcon
								onClick={() =>
									setEditForm({
										isActive: !editForm.isActive,
										...item,
									})
								}
							>
								<Pencil size={16} />
							</ActionIcon>
							<ActionIcon
								color="red"
								onClick={() => deleteHandler(item._id)}
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
					<thead>
						<tr>
							<th>Title</th>
							<th>Status</th>
							<th>Rating</th>
							<th />
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</Table>
			</ScrollArea>
		</>
	);
};

export default MovieList;
