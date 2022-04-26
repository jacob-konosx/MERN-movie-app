import express from "express";

import { signin, signup, addMovieList } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

router.post("/addMovieList/:id", auth, addMovieList);
export default router;
