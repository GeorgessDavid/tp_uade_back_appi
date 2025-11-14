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

/**
 * Servicio para obtener todos los usuarios activos.
 * @returns {Promise<Partial<Usuario>[]>} -- Lista de usuarios sin contraseñas.
 */
export const getAllUsers = async (): Promise<Partial<Usuario>[]> => {
    try {
        // Obtener todos los usuarios activos, excluyendo la contraseña
        const users: Partial<Usuario>[] = await Usuario.findAll({
            where: { activo: true },
            attributes: { exclude: ['contrasena'] }
        });
        
        if (!users || users.length === 0) {
            throw new CustomError(404, 'No se encontraron usuarios');
        }

        return users;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener usuarios');
    }
}

/**
 * Servicio para crear un nuevo usuario.
 * @param {Partial<Usuario>} userData -- Datos del usuario a crear.
 * @returns {Promise<Partial<Usuario>>} -- Usuario creado sin contraseña.
 */
export const createUser = async (userData: Partial<Usuario>): Promise<Partial<Usuario>> => {
    try {
        // Verificar que el usuario no exista
        const existingUser = await Usuario.findOne({ where: { usuario: userData.usuario } });
        if (existingUser) throw new CustomError(400, 'El usuario ya existe');

        // Verificar que el email no exista
        const existingEmail = await Usuario.findOne({ where: { email: userData.email } });
        if (existingEmail) throw new CustomError(400, 'El email ya está registrado');

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(userData.contrasena!, 10);

        // Crear el usuario
        const newUser = await Usuario.create({
            ...userData,
            contrasena: hashedPassword,
            activo: true
        });

        // Retornar usuario sin contraseña
        const { contrasena, ...userWithoutPassword } = newUser.toJSON();
        return userWithoutPassword;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al crear usuario');
    }
}
