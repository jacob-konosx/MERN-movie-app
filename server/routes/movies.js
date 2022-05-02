import express from "express";

import {
	getMovies,
	createMovie,
	getMovie,
	getSearch,
	addReview,
} from "../controllers/moviesController.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getMovies);
router.get("/search/", getSearch);
router.get("/:id", getMovie);

router.post("/addReview/:id", auth, addReview);
router.post("/", auth, createMovie);

export default router;
