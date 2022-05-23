import express from "express";
import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "dotenv/config";

const router = express.Router();

let refreshTokens = [];
function generateAccessToken(user, secret) {
	return jwt.sign(user, secret, {
		expiresIn: "1h",
	});
}

export const logout = (req, res) => {
	refreshTokens = refreshTokens.filter(
		(token) => token !== req.cookies.refreshToken
	);
	res.clearCookie("refreshToken");
	res.sendStatus(204);
};

export const signin = async (req, res) => {
	const accessSecret = process.env.ACCESS_TOKEN_SECRET;
	const refreshSecret = process.env.ACCESS_TOKEN_SECRET;
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
		const accessToken = generateAccessToken(
			{
				email: oldUser.email,
				id: oldUser._id,
			},
			accessSecret
		);

		const refreshToken = jwt.sign(
			{ email: oldUser.email, id: oldUser._id },
			refreshSecret,
			{ expiresIn: "24h" }
		);
		refreshTokens.push(refreshToken);
		res.status(200)
			.cookie(`refreshToken`, refreshToken, {
				secure: true,
				httpOnly: true,
				SameSite: "strict",
			})
			.json({ result: oldUser, accessToken });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const token = async (req, res) => {
	const refreshSecret = process.env.ACCESS_TOKEN_SECRET;
	const accessSecret = process.env.ACCESS_TOKEN_SECRET;

	const refreshToken = req.cookies.refreshToken;
	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

	jwt.verify(refreshToken, refreshSecret, (err, user) => {
		if (err) return res.sendStatus(406);
		const accessToken = generateAccessToken(
			{
				email: user.email,
				id: user.id,
			},
			accessSecret
		);
		res.json({ accessToken: accessToken });
	});
};

export const signup = async (req, res) => {
	const accessSecret = process.env.ACCESS_TOKEN_SECRET;
	const refreshSecret = process.env.ACCESS_TOKEN_SECRET;

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
		const accessToken = generateAccessToken(
			{
				email: result.email,
				id: result._id,
			},
			accessSecret
		);
		const refreshToken = jwt.sign(
			{ email: result.email, id: result._id },
			refreshSecret,
			{ expiresIn: "24h" }
		);
		refreshTokens.push(refreshToken);
		res.status(200)
			.cookie(`refreshToken`, refreshToken, {
				secure: true,
				httpOnly: true,
				SameSite: "strict",
			})
			.json({ result, accessToken });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
		console.log(error);
	}
};

export const updateMovieList = async (req, res) => {
	const id = req.userId;
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
	const id = req.userId;
	const review = req.body;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No user with id: ${id}`);

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
	const id = req.userId;
	const movieId = req.body.movieId;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No user with id: ${id}`);

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
export const update = async (req, res) => {
	const id = req.userId;
	const name = req.body.name;
	const imageUrl = req.body.imageUrl;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No user with id: ${id}`);

	const response = await UserModel.findByIdAndUpdate(
		id,
		{
			$set: { name: name, imageUrl: imageUrl },
		},
		{ new: true }
	);
	res.json(response);
};
export const changePassword = async (req, res) => {
	const userID = req.userId;
	const { password } = req.body;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		await UserModel.findByIdAndUpdate(
			userID,
			{
				$set: { password: hashedPassword },
			},
			{ new: true }
		);
	} catch (error) {
		res.status(500).json({ message: error });
		console.log(error);
	}
};
