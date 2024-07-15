import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/users.js";

dotenv.config({ path: "./confi.env" });

var corsOptions = {
	origin:
		process.env.ENV === "PROD"
			? "https://flix.konosx.dev"
			: "http://localhost:3000",

	credentials: true,
};

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/movie", movieRoutes);
app.use("/user", userRoutes);

const CONNECTION_URL = process.env.ATLAS_URI;
const PORT = 5000;

try {
	mongoose.set("strictQuery", false);
	await mongoose
		.connect(CONNECTION_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: "movies_database",
		})
		.then(() =>
			app.listen(PORT, () =>
				console.log(`Server Running on Port: http://localhost:${PORT}`)
			)
		);
	console.log("MongoDB Connected...");
} catch (err) {
	console.error(err.message);
	process.exit(1);
}

export default app;
