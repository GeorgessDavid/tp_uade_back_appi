import cors from 'cors';
import express from 'express';
import methodOverride from 'method-override';
import index from './src/routes/index';
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', true);

/*
Comentar este bloque para usar en desarrollo.

const redisClient = createClient({
    url: process.env.REDIS_URL
})

redisClient.on('error', (err) => {
    console.error("Redis Error: ", err);
})

redisClient.connect(); */


const allowedOrigins = process.env.FRONT_END_URL
    ? process.env.FRONT_END_URL.split(',').map(origin => origin.trim())
    : undefined;

// Configuración de CORS para peticiones HTTPS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins?.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type']
}))

// Configuración de la cookie Session para el traslado de la misma a través de https -> secure:true sólo en producción
app.use(session({
    // store: new RedisStore({ client: redisClient }), // Comentar esta línea para usar en desarrollo local.
    name: 'auth',
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: false,
        domain: process.env.DOMAIN
    }
}));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Configuración de las rutas
app.use('/', index);
app.use((req: Request, res: Response, next: NextFunction) => {
    res.redirect('/notFound');
    return;
})

// Configuración de arranque del servidor.
app.listen(port, () => {
    console.log(`\nServidor corriendo en \x1b[34;1mhttp://localhost:${port}/\x1b[0m`);
})