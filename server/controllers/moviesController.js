import express from "express";
import mongoose from "mongoose";

import MovieModel from "../models/movie.js";
import UserModel from "../models/user.js";
import { getMovieAverage } from "./userController.js";

const router = express.Router();

export const getMovies = async (req, res) => {
	const ITEMS_PER_PAGE = 9;
	const page = req.query.page || 1;
	const skip = (page - 1) * ITEMS_PER_PAGE;

	try {
		const count = await MovieModel.countDocuments();
		const pageCount = Math.ceil(count / ITEMS_PER_PAGE); // 400 items / 20 = 20

		const tempMovies = await MovieModel.find()
			.sort({ _id: -1 })
			.limit(9)
			.skip(skip);
		const movies = await Promise.all(
			tempMovies.map(async (movie) => {
				const average_rating = await getMovieAverage(
					movie._id.toString()
				);
				if (!average_rating) return movie;
				return {
					...movie._doc,
					average_rating,
				};
			})
		);
		res.status(200).json({ movies, pageCount });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createMovie = async (req, res) => {
	const movie = req.body.body;
	const newMovie = new MovieModel({
		...movie,
	});

	try {
		await newMovie.save();

		res.status(201).json(newMovie);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const getMovie = async (req, res) => {
	const { id } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(404).json({ message: `No movie with id: ${id}` });

		const result = await MovieModel.findById(id);
		if (!result) {
			return res.status(404).json({ message: `No movie with id: ${id}` });
		}
		const movie = {
			...result._doc,
			average_rating: await getMovieAverage(result._id),
		};
		return res.status(200).json(movie);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getSearch = async (req, res) => {
	try {
		const result = await MovieModel.aggregate([
			{
				$search: {
					index: "title",
					autocomplete: {
						query: `${req.query.query}`,
						path: "title",
						fuzzy: {
							maxEdits: 2,
							prefixLength: 3,
						},
					},
				},
			},
		]).limit(10);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const addReview = async (req, res) => {
	const { id } = req.params;
	const review = req.body;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No movie with id: ${id}`);

	const response = await MovieModel.findByIdAndUpdate(
		id,
		{
			$push: { reviews: review },
		},
		{ new: true }
	);
	res.json(response["reviews"]);
};
export const deleteReview = async (req, res) => {
	const { id } = req.params;
	const userId = req.userId;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No movie with id: ${id}`);

	const response = await MovieModel.findByIdAndUpdate(id, {
		$pull: { reviews: { uid: userId } },
	});
	res.json(response);
};

export const updateReview = async (req, res) => {
	const { id } = req.params;
	const { reviewText } = req.body;
	const userId = req.userId;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No movie with id: ${id}`);

	await MovieModel.findByIdAndUpdate(
		id,
		{
			$set: { "reviews.$[elem].text": reviewText },
		},
		{ arrayFilters: [{ "elem.uid": userId }] }
	);
};
export const getAdvSearch = async (req, res) => {
	const genres = req.body?.genres;
	const actors = req.body?.actors;
	const directors = req.body?.directors;
	const title = req.body?.title;
	const year = req.body?.year;
	let compound = {};
	compound["must"] = [];
	if (title !== "")
		compound["must"].push({
			text: {
				query: title,
				path: "title",
				fuzzy: {
					maxEdits: 1,
				},
			},
		});

	let query = [];
	if (title !== "")
		query.push({
			$search: { compound },
		});
	if (year)
		query.push({
			$match: {
				year: year,
			},
		});
	if (genres.length > 0)
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
	if (actors.length > 0)
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
	if (directors.length > 0)
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
	try {
		const result = await MovieModel.aggregate(query).limit(10);
		res.status(200).json(result);
	} catch (error) {
		res.status(404).json({ message: error.message });
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
		res.status(200).json({
			actors: actors[0].actors,
			directors: directors[0].directors,
			genres: genres[0].genres,
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export default router;
