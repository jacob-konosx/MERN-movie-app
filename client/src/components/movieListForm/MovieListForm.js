import { ActionIcon, Group, NumberInput, Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "tabler-icons-react";
import { addMovieList } from "../../actions/movies";
import { CLEAR_SEARCH } from "../../constants/actionTypes";
import Search from "../search/Search";

const MovieListForm = () => {
	const dispatch = useDispatch();
	const [activeForm, setActiveForm] = useState(false);
	const [status, setStatus] = useState(null);
	const [form, setForm] = useState({
		title: null,
		status: null,
		id: null,
	});
	const { _id, moviesList } = useSelector(
		(state) => state.root.authReducer.profile.result
	);
	const formSearch = useSelector(
		(state) => state.root.formReducer.formSearch
	);
	useEffect(() => {
		if (formSearch) {
			setForm({ ...form, title: formSearch.title, id: formSearch.id });
		} else {
			setForm({
				...form,
				title: null,
				id: null,
				rating: null,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formSearch]);
	const handleFormSubmit = async () => {
		if (form.title && status && form.id && form.rating) {
			const newMovieList = [...moviesList, { ...form, status }];
			dispatch(addMovieList(_id, newMovieList));
			dispatch({ type: CLEAR_SEARCH });
			setActiveForm(false);
		}
	};
	return (
		<>
			<Group position="center" style={{ marginTop: "2%" }}>
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
				<div
					style={{
						width: "25%",
						margin: "0 auto",
						marginTop: "2%",
						position: "relative",
					}}
				>
					{!form.title ? (
						<Search option={"movieForm"} />
					) : (
						<Text>
							Movie:{" "}
							<span
								className="formTitle"
								onClick={() => {
									dispatch({ type: "CLEAR_SEARCH" });
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
						min={1}
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
						onChange={setStatus}
					/>
					<ActionIcon
						color="blue"
						variant="outline"
						onClick={() => handleFormSubmit()}
						style={{ margin: "0 auto", marginTop: "2%" }}
					>
						<Plus size={20} />
					</ActionIcon>
				</div>
			)}
		</>
	);
};

export default MovieListForm;
