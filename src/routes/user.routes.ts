import { Router } from 'express';
const router = Router();
import * as controller from '../controllers/user.controller';
import * as validation from '../validations';

router.post('/login', validation.loginProcess, controller.login);

export default router;