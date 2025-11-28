import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/user.controller';
import * as validation from '../validations';
import * as middleware from '../middlewares';

// Rutas públicas - no requieren autenticación
router.post('/login', validation.loginProcess, controller.login);
router.post('/logout', controller.logout);

// Rutas protegidas - requieren autenticación
router.use(middleware.isLogged);
router.get('/', validation.getAllUsers, controller.getAllUsers);
router.post('/create', validation.createUser, controller.createUser);

export default router;