import express from "express";
import auth from "../middleware/auth.js";
import {
	addMoviesList,
	signin,
	signup,
	updateMoviesList,
	getInfo,
	addReview,
	deleteReview,
	refreshAccessToken,
	logout,
	update,
	changePassword,
	deleteMoviesList,
} from "../controllers/userController.js";
import requireValidObjectId from "../middleware/requireValidObjectId.js";

const router = express.Router();

// Unprotected routes
router.get("/getInfo/:id", requireValidObjectId, getInfo);
router.post("/signin", signin);
router.post("/signup", signup);

// Protected routes
router.post("/addMoviesList/", auth, addMoviesList);
router.post("/updateMoviesList/", auth, updateMoviesList);
router.post("/deleteMoviesList/:id", auth, deleteMoviesList);

router.post("/addReviewList/", auth, addReview);
router.post("/deleteReview/", auth, deleteReview);
router.post("/token/", refreshAccessToken);
router.post("/logout/", logout);
router.post("/update/", auth, update);
router.post("/changePassword/", auth, changePassword);

export default router;
