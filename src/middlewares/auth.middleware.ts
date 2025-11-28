import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from '../error/custom.error';

const JWT_SECRET: string = process.env.JWT_SECRET!;

/**
 * Middleware para autenticar solicitudes usando JWT.
 * Verifica el token guardado en las cookies de session.
 * Si no es válido, responde con un error 401.
 * @param {Request} req -- Objeto de solicitud de Express.
 * @param {Response} res -- Objeto de respuesta de Express.
 * @param {NextFunction} next -- Función para pasar al siguiente middleware.
 */
export const isLogged = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.session.auth || {};

    if (!token) throw new CustomError(401, 'Token de autenticación no proporcionado');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if(!decoded) throw new CustomError(401, 'Token de autenticación inválido');
        next();

    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};  