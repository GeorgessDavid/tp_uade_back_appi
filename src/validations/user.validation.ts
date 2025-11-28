const { body } =  require('express-validator');

export const loginProcess = [
    body('usuario').isString().withMessage('El usuario debe ser un string'),
    body('contrasena').isString().withMessage('La contraseña debe ser un string')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
]

export const getAllUsers = [
    // No requiere validaciones de body, solo podría validarse query params si se implementan filtros
]

export const createUser = [
    body('usuario').isString().withMessage('El usuario debe ser un string')
        .isLength({ min: 3, max: 100 }).withMessage('El usuario debe tener entre 3 y 100 caracteres'),
    body('contrasena').isString().withMessage('La contraseña debe ser un string')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('email').isEmail().withMessage('El email debe ser válido')
        .isLength({ max: 150 }).withMessage('El email no debe exceder 150 caracteres'),
    body('nombre').isString().withMessage('El nombre debe ser un string')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').isString().withMessage('El apellido debe ser un string')
        .notEmpty().withMessage('El apellido es obligatorio'),
    body('sexo_biologico').isIn(['Masculino', 'Femenino']).withMessage('El sexo biológico debe ser Masculino o Femenino'),
    body('Rol_id').isInt({ min: 1 }).withMessage('El Rol_id debe ser un número entero válido')
]