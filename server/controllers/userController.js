import express from "express";
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();
const secret = "test";

export const signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const oldUser = await UserModel.findOne({ email });
		if (!oldUser)
			return res.status(404).json({ message: "User doesn't exist" });
		const isPasswordCorrect = await bcrypt.compare(
			password,
			oldUser.password
		);
		if (!isPasswordCorrect)
			return res.status(400).json({ message: "Invalid credentials" });
		const token = jwt.sign(
			{ email: oldUser.email, id: oldUser._id },
			secret,
			{ expiresIn: "1h" }
		);
		res.status(200).json({ result: oldUser, token });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const signup = async (req, res) => {
	const { email, password, firstName, lastName } = req.body;
	try {
		const oldUser = await UserModel.findOne({ email });
		if (oldUser)
			return res.status(400).json({ message: "User already exists" });
		const hashedPassword = await bcrypt.hash(password, 12);
		const result = await UserModel.create({
			email,
			password: hashedPassword,
			name: `${firstName} ${lastName}`,
		});
		const token = jwt.sign(
			{ email: result.email, id: result._id },
			secret,
			{ expiresIn: 60 }
		);
		res.status(201).json({ result, token });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
		console.log(error);
	}
};

export const updateMovieList = async (req, res) => {
	const { id } = req.params;
	const moviesList = req.body;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No users with id: ${id}`);

	const response = await UserModel.findByIdAndUpdate(id, {
		moviesList: moviesList,
	});

	res.json(response);
};

export const getInfo = async (req, res) => {
	const { id } = req.params;

	try {
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			const user = await UserModel.findById(id);
			const { name, _id, imageUrl } = user;
			res.status(200).json({ name, _id, imageUrl });
		} else {
			res.json({ message: "Invalid id" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const addReview = async (req, res) => {
	const { id } = req.params;
	const review = req.body;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No movie with id: ${id}`);

	const response = await UserModel.findByIdAndUpdate(
		id,
		{
			$push: { reviewList: review },
		},
		{ new: true }
	);
	res.json(response["reviewList"]);
};
export const deleteReview = async (req, res) => {
	const { id } = req.params;
	const movieId = req.body.movieId;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No movie with id: ${id}`);

	const response = await UserModel.findByIdAndUpdate(
		id,
		{
			$pull: { reviewList: { movieId: movieId } },
		},
		{ new: true }
	);
	res.json(response["reviewList"]);
};
export default router;
