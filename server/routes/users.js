import express from "express";

import {
	signin,
	signup,
	updateMovieList,
	getInfo,
	addReview,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/getInfo/:id", getInfo);
router.post("/signin", signin);
router.post("/signup", signup);

router.post("/updateMovieList/:id", auth, updateMovieList);
router.post("/addReviewList/:id", auth, addReview);
export default router;
