const { body, param } = require('express-validator');
import { emailValidator } from '../utils';

export const createPaciente = [
    body('nombre').isString().withMessage('El nombre debe ser un string')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres'),
    body('apellido').isString().withMessage('El apellido debe ser un string')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ max: 100 }).withMessage('El apellido no debe exceder 100 caracteres'),
    body('telefono').optional({ nullable: true })
        .isString().withMessage('El teléfono debe ser un string')
        .matches(/^[0-9]+$/).withMessage('El teléfono debe contener solo números')
        .isLength({ max: 40 }).withMessage('El teléfono no debe exceder 40 caracteres'),
    body('email').optional({ nullable: true })
        .isEmail().withMessage('El email debe ser válido')
        .isLength({ max: 150 }).withMessage('El email no debe exceder 150 caracteres')
        .custom(value => emailValidator(value)).withMessage('El email no es válido'),
    body('tipoDocumento').optional()
        .isIn(['LE', 'LC', 'DNI']).withMessage('El tipo de documento debe ser LE, LC o DNI'),
    body('sexo_biologico').isIn(['Masculino', 'Femenino'])
        .withMessage('El sexo biológico debe ser Masculino o Femenino'),
    body('documento').optional({ nullable: true })
        .isString().withMessage('El documento debe ser un string')
        .matches(/^[0-9]+$/).withMessage('El documento debe contener solo números')
        .isLength({ max: 30 }).withMessage('El documento no debe exceder 30 caracteres'),
    body('numeroAfiliado').optional({ nullable: true })
        .isString().withMessage('El número de afiliado debe ser un string')
        .isLength({ max: 60 }).withMessage('El número de afiliado no debe exceder 60 caracteres'),
    body('ObraSocial_id').optional({ nullable: true })
        .isInt().withMessage('El ObraSocial_id debe ser un número entero')
];

export const updatePaciente = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero válido'),
    body('nombre').optional()
        .isString().withMessage('El nombre debe ser un string')
        .notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres'),
    body('apellido').optional()
        .isString().withMessage('El apellido debe ser un string')
        .notEmpty().withMessage('El apellido no puede estar vacío')
        .isLength({ max: 100 }).withMessage('El apellido no debe exceder 100 caracteres'),
    body('telefono').optional({ nullable: true })
        .isString().withMessage('El teléfono debe ser un string')
        .matches(/^[0-9]+$/).withMessage('El teléfono debe contener solo números')
        .isLength({ max: 40 }).withMessage('El teléfono no debe exceder 40 caracteres'),
    body('email').optional({ nullable: true })
        .isEmail().withMessage('El email debe ser válido')
        .isLength({ max: 150 }).withMessage('El email no debe exceder 150 caracteres')
        .custom(value => emailValidator(value)).withMessage('El email no es válido'),
    body('tipoDocumento').optional()
        .isIn(['LE', 'LC', 'DNI']).withMessage('El tipo de documento debe ser LE, LC o DNI'),
    body('sexo_biologico').optional()
        .isIn(['Masculino', 'Femenino']).withMessage('El sexo biológico debe ser Masculino o Femenino'),
    body('documento').optional({ nullable: true })
        .isString().withMessage('El documento debe ser un string')
        .matches(/^[0-9]+$/).withMessage('El documento debe contener solo números')
        .isLength({ max: 30 }).withMessage('El documento no debe exceder 30 caracteres'),
    body('numeroAfiliado').optional({ nullable: true })
        .isString().withMessage('El número de afiliado debe ser un string')
        .isLength({ max: 60 }).withMessage('El número de afiliado no debe exceder 60 caracteres'),
    body('ObraSocial_id').optional({ nullable: true })
        .isInt().withMessage('El ObraSocial_id debe ser un número entero')
];

export const deletePaciente = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero válido')
];

export const getPacienteById = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero válido')
];
