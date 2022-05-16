import jwt from "jsonwebtoken";
import "dotenv/config";

const auth = async (req, res, next) => {
	const secret = process.env.ACCESS_TOKEN_SECRET;

	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.status(401);

	jwt.verify(token, secret, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}
		req.userId = user?.id;
		next();
	});
};

export default auth;
