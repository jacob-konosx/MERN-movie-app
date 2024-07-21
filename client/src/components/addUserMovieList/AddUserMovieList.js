import { ActionIcon, Group, NumberInput, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus } from "tabler-icons-react";
import { SET_USER_MOVIE_FORM_SEARCH } from "../../constants/actionTypes";
import MovieSearchField from "../movieSearchField/MovieSearchField";

import "./AddUserMovieList.css";
import { addMoviesList } from "../../actions/user";

const defaultForm = {
	title: null,
	status: null,
	id: null,
	rating: 0,
};

const AddUserMovieList = () => {
	const dispatch = useDispatch();

	const [activeForm, setActiveForm] = useState(false);
	const [movieForm, setMovieForm] = useState(defaultForm);

	const userMovieFormSearch = useSelector(
		(state) => state.root.userFormReducer.userMovieFormSearch
	);

	const isFormValid =
		movieForm.status && movieForm.title && movieForm.id && movieForm.rating;

	useEffect(() => {
		if (userMovieFormSearch) {
			setMovieForm((form) => ({
				...form,
				title: userMovieFormSearch.title,
				id: userMovieFormSearch.id,
			}));
		} else {
			setMovieForm(defaultForm);
		}
	}, [userMovieFormSearch]);

	const handleAddMovie = async (e) => {
		e.preventDefault();
		if (isFormValid) {
			dispatch(addMoviesList(movieForm));

			setMovieForm(defaultForm);
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
					{!movieForm.title ? (
						<MovieSearchField option={"userMovieList"} />
					) : (
						<Text>
							Movie:{" "}
							<span
								className="formTitle"
								onClick={() => {
									dispatch({
										type: SET_USER_MOVIE_FORM_SEARCH,
										payload: {
											data: null,
										},
									});
								}}
							>
								{movieForm.title}
							</span>
						</Text>
					)}

					<NumberInput
						onChange={(val) =>
							setMovieForm((m) => ({ ...m, rating: val }))
						}
						name="rating"
						required={true}
						label="Rating"
						min={0}
						max={10}
						step={0.1}
						precision={1}
						value={movieForm.rating}
					/>

					<Select
						required={true}
						label="Movie Status"
						placeholder="Choose movie status"
						data={[
							{ value: "Plan to Watch", label: "Plan to Watch" },
							{ value: "Completed", label: "Completed" },
						]}
						onChange={(val) =>
							setMovieForm((m) => ({ ...m, status: val }))
						}
					/>

					<div className="movieFormButton">
						{isFormValid ? (
							<ActionIcon
								color="blue"
								variant="outline"
								onClick={handleAddMovie}
							>
								<Plus size={20} />
							</ActionIcon>
						) : (
							<ActionIcon
								color="blue"
								variant="outline"
								onClick={() => {
									setActiveForm(false);
									setMovieForm(defaultForm);
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

export default AddUserMovieList;
