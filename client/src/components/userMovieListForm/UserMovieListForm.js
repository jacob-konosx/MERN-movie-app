import { ActionIcon, Group, NumberInput, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus } from "tabler-icons-react";
import { updateMovieList } from "../../actions/movie";
import { SET_USER_MOVIE_FORM_FIELD } from "../../constants/actionTypes";
import MovieSearchField from "../movieSearchField/MovieSearchField";

import "./UserMovieListForm.css";

const defaultForm = {
	title: null,
	status: null,
	id: null,
	rating: 0,
};

const UserMovieListForm = ({ moviesList }) => {
	const dispatch = useDispatch();

	const [activeForm, setActiveForm] = useState(false);
	const [movieCompletionStatus, setMovieCompletionStatus] = useState(null);
	const [form, setForm] = useState(defaultForm);
	const [isFormValid, setIsFormValid] = useState(false);

	const userMovieFormSearch = useSelector(
		(state) => state.root.userFormReducer.userMovieFormSearch
	);

	useEffect(() => {
		if (userMovieFormSearch) {
			setForm((form) => {
				return {
					...form,
					title: userMovieFormSearch.title,
					id: userMovieFormSearch.id,
				};
			});
		} else {
			setForm(defaultForm);
		}
	}, [userMovieFormSearch]);

	useEffect(() => {
		if (movieCompletionStatus && form.title && form.id && form.rating) {
			setIsFormValid(true);
		} else {
			setIsFormValid(false);
		}
	}, [form, movieCompletionStatus]);

	const handleFormSubmit = async () => {
		if (isFormValid) {
			const newMovieList = [
				...moviesList,
				{ ...form, status: movieCompletionStatus },
			];
			dispatch(updateMovieList(newMovieList));
			setForm(defaultForm);
			setActiveForm(false);
		}
	};

	return (
		<>
			<Group position="center">
				<Text align="center" size="xl" weight={500}>
					Movie List
				</Text>

				{!activeForm && (
					<ActionIcon
						color="blue"
						variant="outline"
						onClick={() => setActiveForm(true)}
					>
						<Plus size={20} />
					</ActionIcon>
				)}
			</Group>

			{activeForm && (
				<div className="addMovieForm">
					{!form.title ? (
						<MovieSearchField option={"userMovieList"} />
					) : (
						<Text>
							Movie:{" "}
							<span
								className="formTitle"
								onClick={() => {
									dispatch({
										type: SET_USER_MOVIE_FORM_FIELD,
										payload: {
											field: "userMovieFormSearch",
											data: null,
										},
									});
								}}
							>
								{form.title}
							</span>
						</Text>
					)}

					<NumberInput
						onChange={(val) =>
							setForm((m) => ({ ...m, rating: val }))
						}
						name="rating"
						required={true}
						label="Rating"
						min={0}
						max={10}
						step={0.1}
						precision={1}
						value={form.rating}
					/>

					<Select
						required={true}
						label="Movie Status"
						placeholder="Choose movie status"
						data={[
							{ value: "Plan to Watch", label: "Plan to Watch" },
							{ value: "Completed", label: "Completed" },
						]}
						onChange={setMovieCompletionStatus}
					/>

					<div className="movieFormButton">
						{isFormValid ? (
							<ActionIcon
								color="blue"
								variant="outline"
								onClick={() => handleFormSubmit()}
							>
								<Plus size={20} />
							</ActionIcon>
						) : (
							<ActionIcon
								color="blue"
								variant="outline"
								onClick={() => {
									setActiveForm(false);
									setForm(defaultForm);
									setMovieCompletionStatus(null);
								}}
							>
								<Minus size={20} />
							</ActionIcon>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default UserMovieListForm;
