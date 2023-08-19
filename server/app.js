import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import movieRoutes from "./routes/movies.js";
import userRoutes from "./routes/users.js";
//import userRouter from "./routes/user.js";
const app = express();
dotenv.config({ path: "./confi.env" });
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
var corsOptions = {
	origin: ["http://localhost:5000", "https://mern-movie-log.netlify.app"],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/movie", movieRoutes);
app.use("/user", userRoutes);

const CONNECTION_URL = process.env.ATLAS_URI;
const PORT = process.env.PORT || 5000;
try {
	mongoose.set("strictQuery", false);
	await mongoose
		.connect(CONNECTION_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() =>
			app.listen(PORT, () =>
				console.log(`Server Running on Port: http://localhost:${PORT}`)
			)
		);
	console.log("MongoDB Connected...");
} catch (err) {
	console.error(err.message);
	// make the process fail
	process.exit(1);
}

//mongoose.set("useFindAndModify", false);
export default app;
