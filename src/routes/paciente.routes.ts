import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/paciente.controller';
import * as validation from '../validations/paciente.validation';
import * as middleware from '../middlewares';

// Rutas protegidas - requieren autenticación
router.use(middleware.isLogged);
router.get('/', controller.getAllPacientes);
router.get('/:id', validation.getPacienteById, controller.getPacienteById);
router.post('/create', validation.createPaciente, controller.createPaciente);
router.put('/:id', validation.updatePaciente, controller.updatePaciente);
router.delete('/:id', validation.deletePaciente, controller.deletePaciente);

export default router;
