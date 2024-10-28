import { readFileSync, writeFileSync } from "fs";
import { randomUUID } from "node:crypto";
import { resolve } from "path";

const readJSON = (filePath) => {
    const absolutePath = resolve(filePath);
    const data = readFileSync(absolutePath, "utf-8");
    return JSON.parse(data);
};

const writeJSON = (filePath, data) => {
    const absolutePath = resolve(filePath);
    writeFileSync(absolutePath, JSON.stringify(data, null, 2), "utf-8");
};

const movies = readJSON("./movies.json");

export class MovieModel {
    getAll({ genre }) {
        if (genre) {
            return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));
        }
        return movies;
    }

    getById(id) {
        return movies.find(movie => movie.id === id);
    }

    create(input) {
        const newMovie = { id: randomUUID(), ...input };
        movies.push(newMovie);
        writeJSON("./movies.json", movies);
        return newMovie;
    }

    async delete({ id }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) return false;
        movies.splice(movieIndex, 1);
        writeJSON("./movies.json", movies);
        return true;
    }

    async update({ id, input }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) return false;
        movies[movieIndex] = { ...movies[movieIndex], ...input };
        writeJSON("./movies.json", movies);
        return movies[movieIndex];
    }
}
