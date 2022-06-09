import express from "express";

import {
	getMovies,
	createMovie,
	getMovie,
	getSearch,
	addReview,
	deleteReview,
	updateReview,
	getAdvSearch,
} from "../controllers/moviesController.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getMovies);
router.get("/search/", getSearch);
router.post("/advancedSearch/", getAdvSearch);
router.get("/:id", getMovie);

router.post("/addReview/:id", auth, addReview);
router.post("/deleteReview/:id", auth, deleteReview);
router.post("/", auth, createMovie);
router.post("/updateReview/:id", auth, updateReview);

export default router;
