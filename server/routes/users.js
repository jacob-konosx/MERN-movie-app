import express from "express";

import {
	signin,
	signup,
	addMovieList,
	getInfo,
	addReview,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/getInfo/:id", getInfo);
router.post("/signin", signin);
router.post("/signup", signup);

router.post("/addMovieList/:id", auth, addMovieList);
router.post("/addReviewList/:id", addReview);
export default router;
