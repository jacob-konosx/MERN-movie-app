import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
	year: { type: Number, required: true },
	title: { type: String, required: true },
	creator: { type: String, required: true },
	info: {
		type: {
			actors: [String],
			directors: [String],
			genres: [String],
			plot: String,
			rating: Number,
			release_date: String,
			running_time_secs: Number,
		},
		required: true,
	},
});

var MovieModel = mongoose.model("MovieModel", movieSchema, "movies");

export default MovieModel;
