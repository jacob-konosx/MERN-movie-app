import express from "express";
import auth from "../middleware/auth.js";
import {
	getMovies,
	getMovie,
	getSearch,
	addReview,
	deleteReview,
	updateReview,
	getAdvSearch,
	getDirectorsAndActors,
} from "../controllers/moviesController.js";
import requireValidObjectId from "../middleware/requireValidObjectId.js";

const router = express.Router();

// Unprotected routes
router.get("/", getMovies);
router.get("/search/", getSearch);
router.get("/getDirectorsAndActors/", getDirectorsAndActors);
router.get("/:id", requireValidObjectId, getMovie);

// Protected routes
router.post("/addReview/:id", auth, addReview);
router.post("/deleteReview/:id", auth, deleteReview);
router.post("/updateReview/:id", auth, updateReview);
router.post("/advancedSearch/", getAdvSearch);

export default router;
