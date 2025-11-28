const { body, param, query } = require('express-validator');

const estadosValidos = ['Solicitado', 'Confirmado', 'En_Espera', 'Atendido', 'Cancelado'];
const tiposDocumento = ['LE', 'LC', 'DNI'];
const sexosValidos = ['Masculino', 'Femenino'];

export const createTurno = [
    body('fecha').notEmpty().withMessage('La fecha es obligatoria')
        .isDate().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),
    body('hora').notEmpty().withMessage('La hora es obligatoria')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('La hora debe tener formato HH:MM:SS'),
    body('Profesional_id').notEmpty().withMessage('El ID del profesional es obligatorio')
        .isInt().withMessage('El ID del profesional debe ser un número entero'),
    
    // Validaciones del paciente
    body('paciente').notEmpty().withMessage('Los datos del paciente son obligatorios')
        .isObject().withMessage('Los datos del paciente deben ser un objeto'),
    body('paciente.nombre').notEmpty().withMessage('El nombre del paciente es obligatorio')
        .isString().withMessage('El nombre debe ser un string')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    body('paciente.apellido').notEmpty().withMessage('El apellido del paciente es obligatorio')
        .isString().withMessage('El apellido debe ser un string')
        .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
    body('paciente.telefono').optional()
        .isString().withMessage('El teléfono debe ser un string')
        .isLength({ max: 40 }).withMessage('El teléfono no debe exceder 40 caracteres'),
    body('paciente.email').optional()
        .isEmail().withMessage('El email debe ser válido')
        .isLength({ max: 150 }).withMessage('El email no debe exceder 150 caracteres'),
    body('paciente.tipoDocumento').notEmpty().withMessage('El tipo de documento es obligatorio')
        .isIn(tiposDocumento).withMessage(`El tipo de documento debe ser: ${tiposDocumento.join(', ')}`),
    body('paciente.sexo_biologico').notEmpty().withMessage('El sexo biológico es obligatorio')
        .isIn(sexosValidos).withMessage(`El sexo biológico debe ser: ${sexosValidos.join(', ')}`),
    body('paciente.documento').notEmpty().withMessage('El documento es obligatorio')
        .isString().withMessage('El documento debe ser un string')
        .isLength({ min: 7, max: 30 }).withMessage('El documento debe tener entre 7 y 30 caracteres'),
    body('paciente.numeroAfiliado').optional()
        .isString().withMessage('El número de afiliado debe ser un string')
        .isLength({ max: 60 }).withMessage('El número de afiliado no debe exceder 60 caracteres'),
    body('paciente.ObraSocial_id').optional()
        .isInt().withMessage('El ID de obra social debe ser un número entero'),
];

export const updateTurno = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
    body('fecha').optional()
        .isDate().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),
    body('hora').optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('La hora debe tener formato HH:MM:SS'),
    body('estado').optional()
        .isIn(estadosValidos).withMessage(`El estado debe ser: ${estadosValidos.join(', ')}`),
];

export const getTurnoById = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
];

export const deleteTurno = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
];

export const cancelTurno = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
];

export const getAllTurnos = [
    query('offset').optional().isInt({ min: 0 }).withMessage('El offset debe ser un número entero positivo'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El limit debe ser un número entre 1 y 100'),
    query('fecha').optional().isDate().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),
    query('Profesional_id').optional().isInt().withMessage('El ID del profesional debe ser un número entero'),
    query('Paciente_id').optional().isInt().withMessage('El ID del paciente debe ser un número entero'),
    query('estado').optional().isIn(estadosValidos).withMessage(`El estado debe ser: ${estadosValidos.join(', ')}`),
];
