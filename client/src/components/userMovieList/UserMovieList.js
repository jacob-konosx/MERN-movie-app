import { useMemo, useState } from "react";
import {
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	ScrollArea,
} from "@mantine/core";
import {
	ArrowDown,
	ArrowUp,
	Pencil,
	Trash,
	Writing,
	X,
} from "tabler-icons-react";
import { useDispatch } from "react-redux";
import { deleteReview } from "../../actions/movie";
import { Link } from "react-router-dom";
import MovieEditForm from "./MovieEditForm";
import AddUserMovieList from "../addUserMovieList/AddUserMovieList";
import AlertMessage from "../../pages/alertMessage/AlertMessage";

import "react-confirm-alert/src/react-confirm-alert.css";
import "./UserMovieList.css";
import { deleteMoviesList } from "../../actions/user";

const movieColors = {
	completed: "green",
	ptw: "orange",
};

const UserMovieList = ({ user }) => {
	const { moviesList, reviewList } = user;

	const dispatch = useDispatch();

	const [editingMovie, setEditingMovie] = useState(null);
	const [isEditFormActive, setIsEditFormActive] = useState(false);
	const [sort, setSort] = useState({
		type: null,
		mode: null,
	});

	const sortedMoviesList = useMemo(
		() =>
			[...moviesList].sort((a, b) =>
				sort.mode === "ascending"
					? a[sort.type] > b[sort.type]
						? 1
						: -1
					: a[sort.type] < b[sort.type]
					? 1
					: -1
			),
		[sort, moviesList]
	);

	const handleDeleteMovie = (movieId) => {
		dispatch(deleteMoviesList(movieId));

		if (reviewList.some((m) => m.movieId === movieId)) {
			dispatch(deleteReview(movieId));
		}
	};

	const movies = sortedMoviesList.map((movie) => (
		<tr key={movie.id}>
			<td>
				{reviewList.some((m) => m.movieId === movie.id) && (
					<div className="reviewIcon">
						<Writing label="Reviewed" size={16} />
					</div>
				)}

				<Link to={`/movie/${movie.id}`}>
					<Text className="movieListText" size="xl" weight={500}>
						{movie.title}
					</Text>
				</Link>
			</td>

			<td>
				<Badge
					color={movieColors[movie.status.toLowerCase()]}
					variant="outline"
				>
					{movie.status}
				</Badge>
			</td>

			<td>
				<Text className="movieListText" size="xl" color="gray">
					{movie.rating}/10
				</Text>
			</td>

			<td>
				<Group spacing={0} position="right">
					{isEditFormActive === false && (
						<ActionIcon
							color="blue"
							onClick={() => {
								setIsEditFormActive(true);
								setEditingMovie(movie);
							}}
						>
							<Pencil size={16} />
						</ActionIcon>
					)}

					{isEditFormActive && editingMovie.id === movie.id && (
						<ActionIcon
							color="red"
							onClick={() => {
								setIsEditFormActive(false);
								setEditingMovie(null);
							}}
						>
							<X size={16} />
						</ActionIcon>
					)}
					<ActionIcon
						color="red"
						onClick={() => handleDeleteMovie(movie.id)}
					>
						<Trash size={16} />
					</ActionIcon>
				</Group>
			</td>
		</tr>
	));

	const handleSort = (e) => {
		sort.type === e.target.getAttribute("name")
			? setSort({
					...sort,
					mode:
						sort.mode === "descending" ? "ascending" : "descending",
			  })
			: setSort({
					type: e.target.getAttribute("name"),
					mode: "descending",
			  });
	};

	const SortDisplay = ({ type }) => {
		if (sort.type === type) {
			if (sort.mode === "descending") {
				return (
					<div className="sort">
						<ArrowDown />
					</div>
				);
			}
			return (
				<div className="sort">
					<ArrowUp />
				</div>
			);
		}
	};

	return (
		<div className="movieList">
			{isEditFormActive && (
				<MovieEditForm
					props={{
						setIsEditFormActive,
						editingMovie,
						reviewList,
						sortedMoviesList,
					}}
				/>
			)}

			<AddUserMovieList />

			<ScrollArea className="movieListArea">
				<Table>
					{movies.length > 0 ? (
						<>
							<thead align="center">
								<tr>
									<th>
										<p name="title" onClick={handleSort}>
											Title
										</p>
										<SortDisplay type="title" />
									</th>

									<th>
										<p name="status" onClick={handleSort}>
											Status
										</p>
										<SortDisplay type="status" />
									</th>

									<th>
										<p name="rating" onClick={handleSort}>
											Rating
										</p>
										<SortDisplay type="rating" />
									</th>
									<th />
								</tr>
							</thead>
							<tbody>{movies}</tbody>
						</>
					) : (
						<AlertMessage
							alert={{
								text: "No movies in list",
								description:
									"You can add movies to your list from the forum above or browse all movies from the homepage.",
							}}
							button={{ text: "Take me home", path: "" }}
						/>
					)}
				</Table>
			</ScrollArea>
		</div>
	);
};

export default UserMovieList;
