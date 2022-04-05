import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BadgeCard from "../../badgecard/BadgeCard";
import "./Home.css";
const Home = () => {
	const navigate = useNavigate();
	const [movies, setMovies] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:5000/`);

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

			setMovies(record);
		};

		fetchData();

		return;
	}, [navigate]);
	return (
		<div className="movies">
			{movies &&
				movies.map((res) => {
					const { _id, title, info, year } = res;
					return (
						<div className="movie" key={_id}>
							<BadgeCard
								props={{
									mode: "small",
									title,
									info,
									year,
									_id,
								}}
							/>
							{/* <h1>
								{borough} - {name} ({cuisine})
							</h1>
							<Button to={`/restaurant/${_id}`}>View</Button> */}
						</div>
					);
				})}
		</div>
	);
};

export default Home;
