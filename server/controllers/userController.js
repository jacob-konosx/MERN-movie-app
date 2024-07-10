import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.ACCESS_TOKEN_SECRET;
let refreshTokens = [];

const generateAccessToken = (user, secret) => {
	return jwt.sign(user, secret, {
		expiresIn: "1h",
	});
};

const generateRefreshToken = (user, secret) => {
	const refreshToken = jwt.sign({ email: user.email, id: user._id }, secret, {
		expiresIn: "24h",
	});
	refreshTokens.push(refreshToken);

	return refreshToken;
};

export const logout = (req, res) => {
	refreshTokens = refreshTokens.filter(
		(token) => token !== req.cookies.refreshToken
	);
	res.clearCookie("refreshToken");
	return res.sendStatus(204);
};

export const signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await UserModel.findOne({ email });
		if (!existingUser) {
			return res.status(404).json({ message: "User doesn't exist" });
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			existingUser.password
		);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const accessToken = generateAccessToken(existingUser, accessSecret);
		const refreshToken = generateRefreshToken(existingUser, refreshSecret);

		return res
			.cookie(`refreshToken`, refreshToken, {
				secure: true,
				httpOnly: true,
				SameSite: "strict",
			})
			.json({ result: existingUser, accessToken });
	} catch (error) {
		return res.status(409).json({ message: "Couldn't sign in", error });
	}
};

export const refreshAccessToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (refreshToken == null) return res.sendStatus(401);
	if (!refreshTokens.includes(refreshToken)) return res.sendStatus(406);

	jwt.verify(refreshToken, refreshSecret, (err, user) => {
		if (err) return res.sendStatus(406);

		const accessToken = generateAccessToken(user, accessSecret);
		return res.json({ accessToken: accessToken });
	});
};

export const signup = async (req, res) => {
	const { email, password, firstName, lastName } = req.body;

	try {
		const existingUser = await UserModel.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await UserModel.create({
			email,
			password: hashedPassword,
			name: `${firstName} ${lastName}`,
		});

		const accessToken = generateAccessToken(newUser, accessSecret);
		const refreshToken = generateRefreshToken(newUser, refreshSecret);

		return res
			.cookie(`refreshToken`, refreshToken, {
				secure: true,
				httpOnly: true,
				SameSite: "strict",
			})
			.json({ result: newUser, accessToken });
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't sign up user", error });
	}
};

export const updateMovieList = async (req, res) => {
	const userId = req.userId;
	const moviesList = req.body;

	try {
		const result = await UserModel.findByIdAndUpdate(userId, {
			moviesList: moviesList,
		});
		if (!result) {
			return res
				.status(403)
				.json({ message: "Couldn't update movie list" });
		}
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't update movie list", error });
	}
};

export const getInfo = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await UserModel.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const { name, _id, imageUrl, moviesList } = user;
		return res.json({ name, _id, imageUrl, moviesList });
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't get user info", error });
	}
};

export const addReview = async (req, res) => {
	const userId = req.userId;
	const review = req.body;

	try {
		const response = await UserModel.findByIdAndUpdate(
			userId,
			{
				$push: { reviewList: review },
			},
			{ new: true }
		);
		if (!response) {
			return res
				.status(403)
				.json({ message: "Couldn't add review to user" });
		}

		return res.json(response["reviewList"]);
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't add review to user", error });
	}
};

export const deleteReview = async (req, res) => {
	const userId = req.userId;
	const movieId = req.body.movieId;

	try {
		const response = await UserModel.findByIdAndUpdate(
			userId,
			{
				$pull: { reviewList: { movieId: movieId } },
			},
			{ new: true }
		);
		if (!response) {
			return res
				.status(403)
				.json({ message: "Couldn't delete review from user" });
		}

		return res.json(response["reviewList"]);
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't delete review from user", error });
	}
};

export const update = async (req, res) => {
	const userId = req.userId;
	const name = req.body.name;
	const imageUrl = req.body.imageUrl;

	try {
		const response = await UserModel.findByIdAndUpdate(
			userId,
			{
				$set: { name: name, imageUrl: imageUrl },
			},
			{ new: true }
		);
		if (!response) {
			return res
				.status(403)
				.json({ message: "Couldn't update user information" });
		}

		return res.json(response);
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't update user information", error });
	}
};

export const changePassword = async (req, res) => {
	const userId = req.userId;
	const newPassword = req.body.password;

	try {
		const newHashedPassword = await bcrypt.hash(newPassword, 12);

		const result = await UserModel.findByIdAndUpdate(
			userId,
			{
				$set: { password: newHashedPassword },
			},
			{ new: true }
		);
		if (!result) {
			return res
				.status(403)
				.json({ message: "Couldn't change user password" });
		}
	} catch (error) {
		return res
			.status(409)
			.json({ message: "Couldn't change user password", error });
	}
};

//TODO: Change movie review functionality
export const calculateMovieAverage = async (id) => {
	try {
		const response = await UserModel.find(
			{ "moviesList.id": id, "moviesList.status": "Completed" },
			{ _id: 0, moviesList: { $elemMatch: { id: id } } }
		);

		if (response.length === 0) return false;

		const ratings = response.map((item) => {
			return item.moviesList[0].rating;
		});

		const sum = ratings.reduce((a, b) => a + b, 0);
		const avg = sum / ratings.length || 0;

		return Math.round(avg * 10) / 10;
	} catch (error) {
		console.log(error);
	}
};
