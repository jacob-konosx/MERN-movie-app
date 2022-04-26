import express from "express";
import mongoose from "mongoose";

import MovieModel from "../models/movie.js";

const router = express.Router();

export const getMovies = async (req, res) => {
	const ITEMS_PER_PAGE = 9;
	const page = req.query.page || 1;
	const skip = (page - 1) * ITEMS_PER_PAGE;

	try {
		const count = await MovieModel.countDocuments();
		const pageCount = Math.ceil(count / ITEMS_PER_PAGE); // 400 items / 20 = 20

		const movies = await MovieModel.find()
			.sort({ _id: -1 })
			.limit(9)
			.skip(skip);
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
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			const post = await MovieModel.findById(id);
			res.status(200).json(post);
		} else {
			res.json({ message: "Invalid id" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
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

//Update

//Delete

export default router;
