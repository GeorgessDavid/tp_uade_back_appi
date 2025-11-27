import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/horarioAtencion.controller';
import * as validation from '../validations';
import * as middleware from '../middlewares';

// Rutas públicas - no requieren autenticación
router.get('/horarios-atencion', controller.getAllHorariosAtencion);
router.get('/horarios-atencion/:id', validation.getHorarioAtencionById, controller.getHorarioAtencionById);
router.get('/horarios-atencion/:id/slots-disponibles', validation.calcularSlotsDisponibles, controller.calcularSlotsDisponibles);

// Rutas protegidas - requieren autenticación
router.use(middleware.isLogged);
router.post('/horarios-atencion', validation.createHorarioAtencion, controller.createHorarioAtencion);
router.put('/horarios-atencion/:id', validation.updateHorarioAtencion, controller.updateHorarioAtencion);
router.delete('/horarios-atencion/:id', validation.deleteHorarioAtencion, controller.deleteHorarioAtencion);

export default router;
