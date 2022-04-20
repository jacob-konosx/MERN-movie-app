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
import { Pencil, Trash, Plus } from "tabler-icons-react";
import { useState, useEffect } from "react";
import Search from "../search/Search";
import { useSelector, useDispatch } from "react-redux";
import "./MovieList.css";
const jobColors = {
	completed: "green",
	ptw: "orange",
};

const MovieList = ({ movies }) => {
	const [activeForm, setActiveForm] = useState(false);
	const rows = movies.map((item) => (
		<>
			<tr key={item.id}>
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
						<ActionIcon>
							<Pencil size={16} />
						</ActionIcon>
						<ActionIcon color="red">
							<Trash size={16} />
						</ActionIcon>
					</Group>
				</td>
			</tr>
		</>
	));
	const MovieListForm = () => {
		const dispatch = useDispatch();
		const [status, setStatus] = useState(null);
		const [form, setForm] = useState({
			title: null,
			status: null,
			id: null,
		});

		const formData = useSelector(
			(state) => state.root.formReducer.formData
		);
		useEffect(() => {
			if (formData) {
				setForm({ ...form, title: formData.title, id: formData.id });
			} else {
				setForm({
					...form,
					title: null,
					id: null,
					rating: null,
				});
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [formData]);
		const handleFormSubmit = () => {
			if (form.title && status && form.id && form.rating) {
				localStorage.setItem(
					"loginData",
					JSON.stringify({
						token: JSON.parse(localStorage.getItem("loginData"))
							.token,
						result: {
							...JSON.parse(localStorage.getItem("loginData"))
								.result,
							moviesList: [
								...JSON.parse(localStorage.getItem("loginData"))
									.result.moviesList,
								{ ...form, status },
							],
						},
					})
				);
				setActiveForm(false);
				window.location.reload();
			}
		};
		return (
			<div style={{ maxWidth: "25%", margin: "0 auto", marginTop: "2%" }}>
				{!form.title ? (
					<Search option={"movieForm"} />
				) : (
					<Text>
						Movie:{" "}
						<span
							className="formTitle"
							onClick={() => {
								dispatch({ type: "CLEAR_FORM" });
							}}
						>
							{form.title}
						</span>
					</Text>
				)}

				<NumberInput
					onChange={(val) => setForm((m) => ({ ...m, rating: val }))}
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
		);
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
			{activeForm && <MovieListForm />}
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
