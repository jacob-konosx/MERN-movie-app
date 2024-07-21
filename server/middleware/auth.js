import jwt from "jsonwebtoken";
import "dotenv/config";
import mongoose from "mongoose";

const auth = async (req, res, next) => {
	const accessSecret = process.env.ACCESS_TOKEN_SECRET;

	const objectId = req.params.id;
	const userId = req.userId;

	if (objectId && !mongoose.Types.ObjectId.isValid(objectId)) {
		return res.status(404).send(`Not a valid object Id: ${objectId}`);
	}
	if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
		return res.status(404).send(`Not a valid user Id: ${userId}`);
	}

	const authHeader = req.headers.authorization;
	const accessToken = authHeader && authHeader.split(" ")[1];
	if (!accessToken) return res.status(401);

	jwt.verify(accessToken, accessSecret, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid access token" });
		}
		req.userId = user?._id;
		next();
	});
};

export default auth;
