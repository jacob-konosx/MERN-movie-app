import jwt from "jsonwebtoken";
import "dotenv/config";
import requireValidObjectId from "./requireValidObjectId.js";

const auth = async (req, res, next) => {
	const accessSecret = process.env.ACCESS_TOKEN_SECRET;

	//requireValidObjectId(req, res, next);

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
