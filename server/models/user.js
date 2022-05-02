import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	imageUrl: {
		type: String,
		default:
			"https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg",
	},
	moviesList: [
		{
			type: { title: String, status: String, id: String, rating: Number },
			default: [],
		},
	],
	reviewList: [{ type: { movieId: String, default: [] } }],
});

var UserModel = mongoose.model("UserModel", userSchema, "users");

export default UserModel;
