import express from "express";
import auth from "../middleware/auth.js";
import {
	signin,
	signup,
	updateMovieList,
	getInfo,
	addReview,
	deleteReview,
	refreshAccessToken,
	logout,
	update,
	changePassword,
} from "../controllers/userController.js";

const router = express.Router();

// Unprotected routes
router.get("/getInfo/:id", getInfo);
router.post("/signin", signin);
router.post("/signup", signup);

// Protected routes
router.post("/updateMovieList/", auth, updateMovieList);
router.post("/addReviewList/", auth, addReview);
router.post("/deleteReview/", auth, deleteReview);
router.post("/token/", refreshAccessToken);
router.post("/logout/", logout);
router.post("/update/", auth, update);
router.post("/changePassword/", auth, changePassword);

export default router;
