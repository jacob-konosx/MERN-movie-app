import express from "express";

import {
	signin,
	signup,
	updateMovieList,
	getInfo,
	addReview,
	deleteReview,
	token,
	logout,
	update,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/getInfo/:id", getInfo);
router.post("/signin", signin);
router.post("/signup", signup);

router.post("/updateMovieList/", auth, updateMovieList);
router.post("/addReviewList/", auth, addReview);
router.post("/deleteReview/", auth, deleteReview);
router.post("/token/", token);
router.post("/logout/", logout);
router.post("/update/", auth, update);
export default router;
