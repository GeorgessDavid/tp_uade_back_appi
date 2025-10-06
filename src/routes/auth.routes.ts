import { Router, type Router as ExpressRouter } from 'express';
import { register, login } from '../controllers/auth.controller';

const router: ExpressRouter = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
