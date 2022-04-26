import express from "express";

import {
	getMovies,
	createMovie,
	getMovie,
	getSearch,
} from "../controllers/moviesController.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getMovies);
router.get("/search/", getSearch);
router.get("/:id", getMovie);

router.post("/", auth, createMovie);

export default router;
