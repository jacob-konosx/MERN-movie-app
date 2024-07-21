import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { deleteReview } from "../../actions/movie";
import { ActionIcon, NumberInput, Select } from "@mantine/core";
import { Pencil } from "tabler-icons-react";
import { useDispatch } from "react-redux";
import { updateMoviesList } from "../../actions/user";

const MovieEditForm = ({
	props: { setIsEditFormActive, editingMovie, reviewList },
}) => {
	const dispatch = useDispatch();

	const [editFormMovie, setEditFormMovie] = useState(editingMovie);

	const confirmUpdateMovie = () => {
		confirmAlert({
			title: "Confirm to update",
			message:
				'You are trying to update the status of a movie you have reviewed. Reviews can only exist for "Completed" movies. In doing this update the review will also be deleted. Continue with the update?',
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						dispatch(deleteReview(editFormMovie.id));
						updateUserMovieList();
					},
				},
				{
					label: "No",
					onClick: () => {
						setIsEditFormActive(false);
					},
				},
			],
		});
	};

	const handleEditSubmit = () => {
		if (
			reviewList.some((m) => m.movieId === editFormMovie.id) &&
			editFormMovie.status === "Plan to Watch"
		) {
			confirmUpdateMovie();
			return;
		}
		updateUserMovieList();
	};

	const updateUserMovieList = () => {
		dispatch(updateMoviesList(editFormMovie));
		setIsEditFormActive(false);
	};

	return (
		<div className="editForm">
			<h2>Update {editFormMovie.title}</h2>
			<NumberInput
				name="rating"
				required={true}
				label="Rating"
				min={1}
				max={10}
				step={0.1}
				precision={1}
				value={editFormMovie.rating}
				onChange={(val) =>
					setEditFormMovie((prev) => ({ ...prev, rating: val }))
				}
			/>
			<Select
				required={true}
				value={editFormMovie.status}
				label="Movie Status"
				placeholder="Choose movie status"
				data={[
					{ value: "Plan to Watch", label: "Plan to Watch" },
					{ value: "Completed", label: "Completed" },
				]}
				onChange={(val) =>
					setEditFormMovie((prev) => ({ ...prev, status: val }))
				}
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

export default MovieEditForm;
