import { Router, type Router as ExpressRouter } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: ExpressRouter = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/', authenticate, getAllUsers);

export default router;
