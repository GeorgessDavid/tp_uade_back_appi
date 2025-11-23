import { Router } from 'express';
import * as obraSocialController from '../controllers/obraSocial.controller';
import * as obraSocialValidations from '../validations/obraSocial.validation';

const router = Router();

/**
 * GET /api/obras-sociales
 * Obtiene todas las obras sociales con paginación
 */
router.get(
    '/',
    obraSocialValidations.getAllObrasSociales,
    obraSocialController.getAllObrasSociales
);

/**
 * GET /api/obras-sociales/:id
 * Obtiene una obra social por ID
 */
router.get(
    '/:id',
    obraSocialValidations.getObraSocialById,
    obraSocialController.getObraSocialById
);

/**
 * POST /api/obras-sociales
 * Crea una nueva obra social
 */
router.post(
    '/',
    obraSocialValidations.createObraSocial,
    obraSocialController.createObraSocial
);

/**
 * PUT /api/obras-sociales/:id
 * Actualiza una obra social existente
 */
router.put(
    '/:id',
    obraSocialValidations.updateObraSocial,
    obraSocialController.updateObraSocial
);

/**
 * DELETE /api/obras-sociales/:id
 * Elimina una obra social
 */
router.delete(
    '/:id',
    obraSocialValidations.deleteObraSocial,
    obraSocialController.deleteObraSocial
);

export default router;
