import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/user.controller';
import * as validation from '../validations';

router.post('/login', validation.loginProcess, controller.login);
router.get('/users', validation.getAllUsers, controller.getAllUsers);
router.post('/users', validation.createUser, controller.createUser);

export default router;