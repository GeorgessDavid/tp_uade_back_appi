const { body, param, query } = require('express-validator');

export const createHorarioAtencion = [
    body('dia').isIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
        .withMessage('El día debe ser uno de: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado'),
    body('horaInicio').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de inicio debe tener formato HH:MM:SS'),
    body('horaFin').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de fin debe tener formato HH:MM:SS'),
    body('intervalo').isInt({ min: 1 })
        .withMessage('El intervalo debe ser un número entero mayor a 0'),
    body('Profesional_id').isInt({ min: 1 })
        .withMessage('El Profesional_id debe ser un número entero válido')
];

export const updateHorarioAtencion = [
    param('id').isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero válido'),
    body('dia').optional().isIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
        .withMessage('El día debe ser uno de: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado'),
    body('horaInicio').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de inicio debe tener formato HH:MM:SS'),
    body('horaFin').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .withMessage('La hora de fin debe tener formato HH:MM:SS'),
    body('intervalo').optional().isInt({ min: 1 })
        .withMessage('El intervalo debe ser un número entero mayor a 0'),
    body('Profesional_id').optional().isInt({ min: 1 })
        .withMessage('El Profesional_id debe ser un número entero válido')
];

export const deleteHorarioAtencion = [
    param('id').isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero válido')
];

export const getHorarioAtencionById = [
    param('id').isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero válido')
];

export const calcularSlotsDisponibles = [
    param('id').isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero válido'),
    query('fecha').notEmpty()
        .withMessage('La fecha es obligatoria')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('La fecha debe tener formato YYYY-MM-DD')
];
