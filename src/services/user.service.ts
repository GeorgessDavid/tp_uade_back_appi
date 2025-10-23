import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/models';
import { CustomError } from '../error/custom.error';
import { Usuario } from '../types';


const JWT_SECRET: string = process.env.JWT_SECRET!;

const { Usuario } = db;

/**
 * Servicio para el proceso de login de un usuario.
 * @param {string} usuario -- Nombre de usuario.
 * @param {string} password -- Contraseña en texto plano.
 * @returns {Promise<{ user: Partial<Usuario>; token: string }>} -- Objeto con datos del usuario y token JWT.
 */
export const loginProcess = async (usuario: string, password: string): Promise<{ user: Partial<Usuario>; token: string }> => {
    try {
        // Buscar el usuario activo en la base de datos
        const user: Partial<Usuario> = await Usuario.findOne({where: {usuario, activo: true}});
        if (!user) throw new CustomError(401, 'Usuario o contraseña incorrectos');

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.contrasena!);
        if (!isValidPassword) throw new CustomError(401, 'Usuario o contraseña incorrectos');
        
        // Generar el token JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
        return { user, token };
    } catch (error) {
        if (error instanceof CustomError) throw new CustomError(error.status, error.message);
        console.error(error);
        throw new Error('Internal server error');
    }
}
