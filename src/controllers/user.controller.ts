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
        res.cookie('username', usuario);
        res.cookie('id', id);
        res.cookie('token', token);
        res.cookie('usuario', usuario);
        res.cookie('nombre', nombre);
        res.cookie('apellido', apellido);

        res.status(200).json({ message: 'Inicio de sesión exitoso', user, token });

    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
}
