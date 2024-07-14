import MovieModel from "../models/movie.js";
import { calculateMovieAverage } from "./userController.js";

export const getMovies = async (req, res) => {
	const ITEMS_PER_PAGE = 9;
	const currentPage = req.query.page || 1;
	const skipCount = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
		const movieCount = await MovieModel.countDocuments();
		const pageCount = Math.ceil(movieCount / ITEMS_PER_PAGE); // 400 items / 20 = 20

		const tempMovies = await MovieModel.find()
			.sort({ _id: -1 })
			.limit(9)
			.skip(skipCount);

		const movies = await Promise.all(
			tempMovies.map(async (movie) => {
				const averageMovieRating = await calculateMovieAverage(
					movie._id.toString()
				);
				if (!averageMovieRating) return movie;

				return {
					...movie._doc,
					averageMovieRating,
				};
			})
		);
		if (!movies) {
			return res.status(404).json({ message: "No movies found" });
		}

		return res.json({ movies, pageCount });
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't get movies", error: error.message });
	}
};

export const getMovie = async (req, res) => {
	const movieId = req.params.id;

	try {
		const movieResult = await MovieModel.findById(movieId);

		if (!movieResult) {
			return res.status(404).json({ message: "Movie not found" });
		}

		const movie = {
			...movieResult._doc,
			averageMovieRating: await calculateMovieAverage(movieResult._id),
		};

		return res.json(movie);
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't get movie", error: error.message });
	}
};

export const getSearch = async (req, res) => {
	try {
		const result = await MovieModel.find({
			title: { $regex: RegExp(`${req.query.q}`, "i") },
		}).limit(10);
		return res.json(result);
	} catch (error) {
		return res.status(409).json({
			message: "Couldn't search for movie",
			error: error.message,
		});
	}
};

export const addReview = async (req, res) => {
	const movieId = req.params.id;
	const review = req.body;

	try {
		const response = await MovieModel.findByIdAndUpdate(
			movieId,
			{
				$push: { reviews: review },
			},
			{ new: true }
		);
		if (!response) {
			return res
				.status(403)
				.json({ message: "Couldn't add movie review" });
		}

		return res.json(response["reviews"]);
	} catch (error) {
		return res.status(409).json({
			message: "Couldn't add movie review",
			error: error.message,
		});
	}
};

export const deleteReview = async (req, res) => {
	const movieId = req.params.id;
	const userId = req.userId;

	try {
		const response = await MovieModel.findByIdAndUpdate(movieId, {
			$pull: { reviews: { uid: userId } },
		});
		if (!response) {
			return res
				.status(403)
				.json({ message: "Couldn't delete movie review" });
		}

		return res.json(response);
	} catch (error) {
		return res.status(409).json({
			message: "Couldn't delete movie review",
			error,
		});
	}
};

export const updateReview = async (req, res) => {
	const movieId = req.params.id;
	const userId = req.userId;
	const reviewText = req.body.reviewText;

	try {
		const response = await MovieModel.findByIdAndUpdate(
			movieId,
			{
				$set: { "reviews.$[elem].text": reviewText },
			},
			{ arrayFilters: [{ "elem.uid": userId }] }
		);
		if (!response) {
			return res
				.status(403)
				.json({ message: "Couldn't update movie review" });
		}

		return res.json(response);
	} catch (error) {
		return res.status(409).json({
			message: "Couldn't update movie review",
			error,
		});
	}
};

export const getAdvSearch = async (req, res) => {
	const genres = req.body?.genres;
	const actors = req.body?.actors;
	const directors = req.body?.directors;
	const title = req.body?.title;
	const year = req.body?.year;

	let query = [];
	let compound = {};
	compound["must"] = [];

	if (title !== "") {
		compound["must"].push({
			text: {
				query: title,
				path: "title",
				fuzzy: {
					maxEdits: 1,
				},
			},
		});
	}
	if (title !== "") {
		query.push({
			$search: { compound },
		});
	}
	if (year) {
		query.push({
			$match: {
				year: year,
			},
		});
	}
	if (genres.length > 0) {
		query.push({
			$match: {
				$and: [
					{
						"info.genres": {
							$all: genres,
						},
					},
				],
			},
		});
	}
	if (actors.length > 0) {
		query.push({
			$match: {
				$and: [
					{
						"info.actors": {
							$all: actors,
						},
					},
				],
			},
		});
	}
	if (directors.length > 0) {
		query.push({
			$match: {
				$and: [
					{
						"info.directors": {
							$all: directors,
						},
					},
				],
			},
		});
	}

	try {
		const result = await MovieModel.aggregate(query).limit(10);
		return res.json(result);
	} catch (error) {
		return res.status(409).json({
			message: "Couldn't advance search movies",
			error,
		});
	}
};

export const getDirectorsAndActors = async (req, res) => {
	try {
		const actors = await MovieModel.aggregate([
			{
				$unwind: { path: "$info.actors" },
			},
			{
				$group: {
					_id: null,
					actors: {
						$addToSet: "$info.actors",
					},
				},
			},
		]);

		const directors = await MovieModel.aggregate([
			{
				$unwind: { path: "$info.directors" },
			},
			{
				$group: {
					_id: null,
					directors: {
						$addToSet: "$info.directors",
					},
				},
			},
		]);

		const genres = await MovieModel.aggregate([
			{
				$unwind: { path: "$info.genres" },
			},
			{
				$group: {
					_id: null,
					genres: {
						$addToSet: "$info.genres",
					},
				},
			},
		]);

		return res.json({
			actors: actors[0].actors,
			directors: directors[0].directors,
			genres: genres[0].genres,
		});
	} catch (error) {
		return res.status(409).json({
			message: "Couldn't get directors, actors and genres",
			error,
		});
	}
};
