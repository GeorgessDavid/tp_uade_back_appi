const { body } =  require('express-validator');

export const loginProcess = [
    body('usuario').isString().withMessage('El usuario debe ser un string'),
    body('contrasena').isString().withMessage('La contraseña debe ser un string')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
]