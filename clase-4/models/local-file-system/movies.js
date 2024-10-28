import { readFileSync, writeFileSync } from "fs";
import { randomUUID } from "node:crypto";
import { resolve } from "path";
// import {readJSON} from 'util.js'

// Función para leer JSON
const readJSON = (filePath) => {
    const absolutePath = resolve(filePath); // Resuelve la ruta absoluta
    const data = readFileSync(absolutePath, "utf-8"); // Lee el archivo
    return JSON.parse(data); // Devuelve el JSON parseado
};

// Función para escribir JSON
const writeJSON = (filePath, data) => {
    const absolutePath = resolve(filePath);
    writeFileSync(absolutePath, JSON.stringify(data, null, 2), "utf-8");
};

// Cargar las películas
const movies = readJSON("./movies.json");

export class MovieModel {
    static getAll({ genre }) {
        if (genre) {
            return movies.filter(
                movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            );
        }
        return movies;
    }

    static getById(id) {
        const movie = movies.find(movie => movie.id === id);
        return movie;
    }

    static create(input) {
        const newMovie = {
            id: randomUUID(),
            ...input
        };
        movies.push(newMovie);
        writeJSON("./movies.json", movies); // Guardar cambios
        return newMovie;
    }

    static async delete({ id }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) return false;
        movies.splice(movieIndex, 1);
        writeJSON("./movies.json", movies); // Guardar cambios
        return true;
    }

    static async update({ id, input }) {
        const movieIndex = movies.findIndex((movie) => movie.id === id);
        if (movieIndex === -1) return false;
        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        };
        writeJSON("./movies.json", movies); // Guardar cambios
        return movies[movieIndex];
    }
}
