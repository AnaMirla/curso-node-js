import {createApp} from './app.js';
import {MovieModel} from './models/mysql/movieDB.js';

createApp({movieModel: MovieModel})
