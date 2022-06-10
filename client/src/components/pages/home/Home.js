import { Pagination } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies, getRatings } from "../../../actions/movies";
import BadgeCard from "../../badgecard/BadgeCard";
import Search from "../../search/Search";
import "./Home.css";
const Home = () => {
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const data = useSelector((state) => state.root.movieReducer?.homeMovies);
	useEffect(() => {
		dispatch(getMovies(page));
	}, [page]);
	useEffect(() => {
		if (data) {
			setPageCount(data.pageCount);
		}
	}, [data]);
	return (
		<>
			<div className="movieSection">
				<div className="homeHead">
					<div className="homeSearch">
						<Search />
					</div>
					<Pagination
						className="homePagination"
						page={page}
						onChange={setPage}
						total={pageCount}
					/>
				</div>

				<div className="movies">
					{data && data.movies && data?.currentPage === page ? (
						data.movies.map((res) => {
							const { _id, title, info, year, average_rating } =
								res;
							return (
								<div className="movie" key={_id}>
									<BadgeCard
										props={{
											mode: "small",
											title,
											info,
											year,
											_id,
											average_rating,
										}}
									/>
								</div>
							);
						})
					) : (
						<div className="loader">
							<div className="waterfall">
								<div></div>
								<div></div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
