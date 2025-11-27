import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/paciente.controller';
import * as validation from '../validations/paciente.validation';
import * as middleware from '../middlewares';

// Rutas protegidas - requieren autenticación
router.use(middleware.isLogged);
router.get('/pacientes', controller.getAllPacientes);
router.get('/pacientes/:id', validation.getPacienteById, controller.getPacienteById);
router.post('/pacientes', validation.createPaciente, controller.createPaciente);
router.put('/pacientes/:id', validation.updatePaciente, controller.updatePaciente);
router.delete('/pacientes/:id', validation.deletePaciente, controller.deletePaciente);

export default router;
