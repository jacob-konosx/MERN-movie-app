import { Pagination } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BadgeCard from "../../badgecard/BadgeCard";
import "./Home.css";
const Home = () => {
	const navigate = useNavigate();
	const [data, setData] = useState(null);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:5000/?page=${page}`);

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

			setData(record);
		};

		fetchData();

		return;
	}, [navigate, page]);
	useEffect(() => {
		if (data) {
			setPageCount(data.pageCount);
		}
	}, [data]);

	return (
		<div>
			<Pagination
				style={{ position: "relative", marginTop: 20, left: "11%" }}
				page={page}
				onChange={setPage}
				total={pageCount}
			/>
			<div className="movies">
				{data &&
					data.movies.map((res) => {
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
							</div>
						);
					})}

				{/* <Button disabled={page === 1} onClick={handlePrevious}>
					Previous
				</Button>
				<Button disabled={page === pageCount} onClick={handleNext}>
					Next
				</Button>
				<p>Page: {page}</p>
				<p>Page Count: {pageCount}</p> */}
			</div>
		</div>
	);
};

export default Home;
