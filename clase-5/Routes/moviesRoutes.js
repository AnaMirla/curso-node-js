// moviesRoutes.js
import { Router } from "express";
import { MovieModel } from "../models/mysql/movieDB.js";
import { MovieController } from "../controllers/moviesController.js";

export const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router();
    const movieController = new MovieController({ movieModel });

    moviesRouter.get("/", movieController.getAll.bind(movieController));
    moviesRouter.get("/:id", movieController.getById.bind(movieController));
    moviesRouter.post("/", movieController.create.bind(movieController));
    moviesRouter.patch("/:id", movieController.update.bind(movieController));
    moviesRouter.delete("/:id", movieController.delete.bind(movieController));

    return moviesRouter;
};
