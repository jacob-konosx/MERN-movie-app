import { TextInput } from "@mantine/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./Search.css";
const Search = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [result, setResult] = useState([]);
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
		<div className="search">
			<TextInput
				style={{
					position: "relative",
					maxWidth: "15%",
					float: "right",
					marginRight: 20,
					top: 22,
				}}
				label="Find movie"
				placeholder="Enter movie title"
				value={searchQuery}
				onChange={(e) => handleChange(e)}
			/>
			<div className="dropdown-content">
				{result.map((movie) => (
					<a key={movie._id} href={`/movie/${movie._id}`}>
						{movie.title}
					</a>
				))}
			</div>
		</div>
	);
};

export default Search;
