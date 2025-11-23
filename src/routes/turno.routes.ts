import { Router } from 'express';
import * as turnoController from '../controllers/turno.controller';
import * as turnoValidations from '../validations/turno.validation';

const router = Router();

/**
 * GET /api/turnos
 * Obtiene todos los turnos con filtros opcionales (fecha, profesional, paciente, estado)
 */
router.get(
    '/',
    turnoValidations.getAllTurnos,
    turnoController.getAllTurnos
);

/**
 * GET /api/turnos/:id
 * Obtiene un turno por ID con toda su información relacionada
 */
router.get(
    '/:id',
    turnoValidations.getTurnoById,
    turnoController.getTurnoById
);

/**
 * POST /api/turnos
 * Crea un nuevo turno
 * Busca o crea el paciente automáticamente usando el documento
 */
router.post(
    '/',
    turnoValidations.createTurno,
    turnoController.createTurno
);

/**
 * PUT /api/turnos/:id
 * Actualiza un turno existente (fecha, hora o estado)
 */
router.put(
    '/:id',
    turnoValidations.updateTurno,
    turnoController.updateTurno
);

/**
 * DELETE /api/turnos/:id
 * Elimina un turno (soft delete)
 */
router.delete(
    '/:id',
    turnoValidations.deleteTurno,
    turnoController.deleteTurno
);

/**
 * POST /api/turnos/:id/cancelar
 * Cancela un turno (cambia estado a Cancelado)
 */
router.post(
    '/:id/cancelar',
    turnoValidations.cancelTurno,
    turnoController.cancelTurno
);

export default router;
