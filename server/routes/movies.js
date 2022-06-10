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
	getDirectorsAndActors,
} from "../controllers/moviesController.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getMovies);
router.get("/search/", getSearch);
router.get("/getDirectorsAndActors/", getDirectorsAndActors);
router.get("/:id", getMovie);

router.post("/addReview/:id", auth, addReview);
router.post("/deleteReview/:id", auth, deleteReview);
router.post("/", auth, createMovie);
router.post("/updateReview/:id", auth, updateReview);
router.post("/advancedSearch/", getAdvSearch);

export default router;
