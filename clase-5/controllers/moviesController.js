import { validateMovie, validatePartialMovie } from "../Schemas/movieSchema.js";

export class MovieController {
    constructor({ movieModel }) {
        this.movieModel = new movieModel();
    }

    async getAll(req, res) {
        const { genre } = req.query;
        const movies = await this.movieModel.getAll({ genre });
        res.json(movies);
    }

    async getById(req, res) {
        const { id } = req.params;
        const movie = await this.movieModel.getById(id);
        if (movie) return res.json(movie);
        res.status(404).json({ message: "Movie Not Found" });
    }

    async create(req, res) {
        const result = validateMovie(req.body);
        if (!result.success) return res.status(400).json(result.error.issues);
        const newMovie = await this.movieModel.create(result.data);
        res.status(201).json(newMovie);
    }

    async update(req, res) {
        const result = validatePartialMovie(req.body);
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
        const { id } = req.params;
        const updatedMovie = await this.movieModel.update({ id, input: result.data });
        if (!updatedMovie) return res.status(404).json({ message: "Movie Not Found" });
        return res.json(updatedMovie);
    }

    async delete(req, res) {
        const { id } = req.params;
        const result = await this.movieModel.delete({ id });
        if (!result) return res.status(404).json({ message: "Movie Not Found" });
        return res.json(result);
    }
}
