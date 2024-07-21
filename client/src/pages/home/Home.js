import { Pagination } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovies } from "../../actions/movie";
import MovieCard from "../../components/movieCard/MovieCard";
import MovieSearchField from "../../components/movieSearchField/MovieSearchField";
import Loader from "../../components/loader/Loader";

import "./Home.css";

const Home = () => {
	const dispatch = useDispatch();
	const [page, setPage] = useState(1);

	const movieData = useSelector(
		(state) => state.root.movieReducer?.homeMovies
	);

	useEffect(() => {
		dispatch(getMovies(page));
	}, [page, dispatch]);

	if (!movieData) {
		return <Loader />;
	}

	return (
		<div className="movieSection">
			<div className="homeHead">
				<div className="homeSearch">
					<MovieSearchField option="home" />
				</div>
				<Pagination
					className="homePagination"
					page={page}
					onChange={setPage}
					total={movieData.pageCount}
				/>
			</div>

			{movieData?.currentPage === page ? (
				<div className="movies">
					{movieData.movies.map((res) => {
						return (
							<div className="movie" key={res._id}>
								<MovieCard
									props={{
										mode: "small",
										...res,
									}}
								/>
							</div>
						);
					})}
				</div>
			) : (
				<Loader />
			)}
		</div>
	);
};

export default Home;
