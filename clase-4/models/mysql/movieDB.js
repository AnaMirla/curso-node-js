import mysql from 'mysql2/promise';
import {validatePartialMovie} from '../../Schemas/movieSchema.js';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config);


export class MovieModel {
    getAll = async ({ genre }) => {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();

            const [genres] = await connection.query(
                'SELECT id, name FROM genre WHERE LOWER(name) =?', [lowerCaseGenre]
            )

            if (genre.length === 0) return []

            const [{ id }] = genres

            return []
        }
        const [movies] = await connection.query('SELECT *, BIN_TO_UUID(id) id FROM movie;');
        return movies;
    }

    getById =async (id) => {
        const [movies] = await connection.query(`SELECT *, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`, [id])

        if (movies.length === 0) return null;

        return movies;
    }

    create = async (input) => {
        const {
            genre: genreInput,
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input;

        const [uuidResult] = await connection.query('SELECT UUID() uuid')
        const [{ uuid }] = uuidResult

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
            VALUES (UUID_TO_BIN("${uuid}"), ?,?,?,?,?,?);`,
                [title, year, director, duration, poster, rate]
            )
        } catch (e) {
            throw new Error('Error creating movie')
        }

        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid]
        )

        return movies[0];

        console.log(result);
    }

    delete = async ({ id }) =>{

        const [movie] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        )
        const [result] = await connection.query(
            `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
        )

        return movie[0];
    }

    update = async ({ id, input }) =>  {
        const validationResult = validatePartialMovie(input);
        if (!validationResult.success) {
            throw new Error(`Errores de validación: ${JSON.stringify(validationResult.error.format())}`);
        }
    
        const inputData = validationResult.data;
    
        try {
            
            const [movies] = await connection.query(
                `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id FROM movie WHERE id = UUID_TO_BIN(?);`,
                [id]
            );
    
            if (movies.length === 0) {
                throw new Error(`No se encontró la película con id ${id}`);
            }
    
            const currentMovie = movies[0];
            const updatedData = {
                title: inputData.title ?? currentMovie.title,
                year: inputData.year ?? currentMovie.year,
                director: inputData.director ?? currentMovie.director,
                duration: inputData.duration ?? currentMovie.duration,
                poster: inputData.poster ?? currentMovie.poster,
                rate: inputData.rate ?? currentMovie.rate
            };
    
            await connection.query(
                `UPDATE movie SET title=?, year=?, director=?, duration=?, poster=?, rate=? WHERE id = UUID_TO_BIN(?);`,
                [updatedData.title, updatedData.year, updatedData.director, updatedData.duration, updatedData.poster, updatedData.rate, id]
            );
    
            return { ...currentMovie, ...updatedData };  
        } catch (error) {
            console.error("Error al actualizar la película:", error.message);
            throw error;
        }
    }
};
