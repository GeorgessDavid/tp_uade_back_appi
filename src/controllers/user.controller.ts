const { validationResult } = require("express-validator");
import { Request, Response } from "express";
import { CustomError } from "../error/custom.error";
import * as service from '../services/user.service';


export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Campos vacíos', errors.array());

        const { usuario, contrasena } = req.body;

        const { user, token } = await service.loginProcess(usuario, contrasena);

        const { id, nombre, apellido, Rol_id } = user;

        req.session.auth = {
            token,
            id,
            nombre,
            apellido,
            Rol_id: Rol_id as 1 | 2 | 3
        }

        // Setear cookies -- Al no poner MaxAge o Expires, las cookies serán de sesión y se eliminarán al cerrar el navegador.
        // En caso de que se llegue a usar dominios o se despliegue en Vercel. 
        // Se deberá agregar los atributos 'domain', 'secure', 'sameSite' y 'httpOnly' según corresponda.
        // Por ejemplo, podría ser algo así:
        // res.cookie('username', username, { 
        //      domain: process.env.DOMAIN,
        //      secure: process.env.NODE_ENV === 'production', 
        //      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
        //      httpOnly: false 
        // });
        res.cookie('id', id, {
            domain: process.env.DOMAIN,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: false
        });
        res.cookie('token', token, {
            domain: process.env.DOMAIN,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: false
        });
        res.cookie('usuario', usuario, {
            domain: process.env.DOMAIN,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: false
        });
        res.cookie('nombre', nombre, {
            domain: process.env.DOMAIN,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: false
        });
        res.cookie('apellido', apellido, {
            domain: process.env.DOMAIN,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: false
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', user, token });

    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        // Destruir la sesión
        req.session.destroy((err) => {
            if (err) {
                throw new CustomError(500, 'Error al cerrar sesión');
            }
        })
        // Limpiar las cookies relacionadas con la sesión
        res.clearCookie('username');
        res.clearCookie('id');
        res.clearCookie('token');
        res.clearCookie('usuario');
        res.clearCookie('nombre');
        res.clearCookie('apellido');
        res.status(200).json({ message: 'Cierre de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor al cerrar sesión' });
    };
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const users = await service.getAllUsers();

        res.status(200).json({ message: 'Usuarios obtenidos exitosamente', users });

    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { usuario, contrasena, email, nombre, apellido, sexo_biologico, Rol_id } = req.body;

        const newUser = await service.createUser({
            usuario,
            contrasena,
            email,
            nombre,
            apellido,
            sexo_biologico,
            Rol_id
        });

        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });

    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
}
