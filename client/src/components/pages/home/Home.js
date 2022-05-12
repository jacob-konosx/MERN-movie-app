import { Pagination } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../../../actions/movies";
import BadgeCard from "../../badgecard/BadgeCard";
import Search from "../../search/Search";
import "./Home.css";
const Home = () => {
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const data = useSelector((state) => state.root.movieReducer);
	useEffect(() => {
		dispatch(getMovies(page));
	}, [page]);
	useEffect(() => {
		if (data) {
			setPageCount(data.pageCount);
		}
	}, [data]);
	return (
		<div>
			<div>
				<div className="homeSearch">
					<Search />
				</div>
				<Pagination
					style={{
						position: "relative",
						marginTop: 20,
						left: "10.4%",
					}}
					page={page}
					onChange={setPage}
					total={pageCount}
				/>
			</div>
			<div className="movies">
				{data &&
					data.movies &&
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
			</div>
		</div>
	);
};

export default Home;
