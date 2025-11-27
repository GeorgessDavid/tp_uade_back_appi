import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/user.controller';
import * as validation from '../validations';
import * as middleware from '../middlewares';

// Rutas públicas - no requieren autenticación
router.post('/login', validation.loginProcess, controller.login);

// Rutas protegidas - requieren autenticación
router.use(middleware.isLogged);
router.get('/users', validation.getAllUsers, controller.getAllUsers);
router.post('/users', validation.createUser, controller.createUser);

export default router;