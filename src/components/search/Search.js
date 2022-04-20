import { Text, TextInput } from "@mantine/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Search.css";
const Search = ({ option }) => {
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = useState("");
	const [result, setResult] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`http://localhost:5000/search?query=${searchQuery}`
			);

			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const record = await response.json();
			if (!record) {
				window.alert(`Record not found`);
				return;
			}
			setResult(record);
		};
		if (searchQuery) fetchData();
	}, [searchQuery]);

	const handleChange = (e) => {
		setSearchQuery(e.currentTarget.value);
		if (e.currentTarget.value === "") setResult([]);
	};

	return (
		<div>
			<TextInput
				label="Find movie"
				placeholder="Enter movie title"
				value={searchQuery}
				onChange={(e) => handleChange(e)}
			/>
			<div className={`dropdown-content`}>
				{result.map((movie) => (
					<Text
						className="searchMovie"
						key={movie._id}
						onClick={() =>
							option === "movieForm"
								? dispatch({
										type: "ADD_FORM",
										data: {
											title: movie.title,
											id: movie._id,
										},
								  })
								: navigate(`/movie/${movie._id}`)
						}
					>
						{movie.title}
					</Text>
				))}
			</div>
		</div>
	);
};

export default Search;
