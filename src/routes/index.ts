import express from 'express';
import userRoutes from './user.routes';
import pacienteRoutes from './paciente.routes';
import horarioAtencionRoutes from './horarioAtencion.routes';

const router = express.Router();

router.get('/status', (req,res) => res.status(200).json({status: 'OK'}));

router.use('/api', userRoutes);
router.use('/api', pacienteRoutes);
router.use('/api', horarioAtencionRoutes);

export default router;