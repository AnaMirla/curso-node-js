import cors from 'cors';

const ACCEPTED_ORIGINS = [
    "http://localhost:1234",
    "http://localhost:3000",
    "http://localhost:8080"
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
        origin: (origin, callback) => {
            // Lista blanca de orígenes permitidos
            
    
            // Si el origen está en la lista blanca o no se provee (caso de solicitudes internas)
            if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true
})