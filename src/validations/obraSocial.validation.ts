const { body, param, query } = require('express-validator');
import { onlyWords } from "utils";

export const createObraSocial = [
    body('nombre').isString().withMessage('El nombre debe ser un string')
        .notEmpty().withMessage('El nombre es obligatorio')
        .custom(value => onlyWords(value)).withMessage('El nombre solo debe contener letras y espacios'),
    body('siglas').isString().withMessage('Las siglas deben ser un string')
        .notEmpty().withMessage('Las siglas son obligatorias')
        .isLength({ max: 20 }).withMessage('Las siglas no deben exceder 20 caracteres'),
    body('rna').isString().withMessage('El RNA debe ser un string')
        .notEmpty().withMessage('El RNA es obligatorio')
        .isLength({ max: 20 }).withMessage('El RNA no debe exceder 20 caracteres'),
];

export const updateObraSocial = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
    body('nombre').isString().withMessage('El nombre debe ser un string')
        .notEmpty().withMessage('El nombre es obligatorio')
        .custom(value => onlyWords(value)).withMessage('El nombre solo debe contener letras y espacios'),
    body('siglas').isString().withMessage('Las siglas deben ser un string')
        .notEmpty().withMessage('Las siglas son obligatorias')
        .isLength({ max: 20 }).withMessage('Las siglas no deben exceder 20 caracteres'),
    body('rna').isString().withMessage('El RNA debe ser un string')
        .notEmpty().withMessage('El RNA es obligatorio')
        .isLength({ max: 20 }).withMessage('El RNA no debe exceder 20 caracteres'),
];

export const getObraSocialById = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
];

export const deleteObraSocial = [
    param('id').isInt().withMessage('El ID debe ser un número entero')
        .notEmpty().withMessage('El ID es obligatorio'),
];

export const getAllObrasSociales = [
    query('offset').optional().isInt({ min: 0 }).withMessage('El offset debe ser un número entero positivo'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El limit debe ser un número entre 1 y 100'),
];


