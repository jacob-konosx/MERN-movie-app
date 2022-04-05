import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BadgeCard from "../../badgecard/BadgeCard";

const Movie = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:5000/movie/${id}`);

			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const record = await response.json();
			if (!record) {
				window.alert(`Record not found`);
				navigate("/");
				return;
			}

			setMovie(record);
		};

		fetchData();

		return;
	}, [id, navigate]);
	//const { name, cuisine, borough, grades, _id } = restaurant;
	return (
		<div>
			{movie && (
				<>
					<BadgeCard
						props={{
							mode: "big",
							title: movie.title,
							info: movie.info,
							year: movie.year,
							_id: movie._id,
						}}
					/>
				</>
			)}
		</div>
	);
};

export default Movie;
