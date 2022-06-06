import mongoose from "mongoose";

const movieSchema = mongoose.Schema({
	year: { type: Number, required: true },
	title: { type: String, required: true },
	creator: { type: String, required: true },
	reviews: [
		{
			type: {
				uid: String,
				text: String,
				createdAt: {
					type: Date,
					default: new Date(),
				},
			},
			default: [],
		},
	],
	info: {
		type: {
			actors: [String],
			directors: [String],
			genres: [String],
			plot: String,
			release_date: String,
			running_time_secs: Number,
		},
		required: true,
	},
});

var MovieModel = mongoose.model("MovieModel", movieSchema, "movies");

export default MovieModel;
