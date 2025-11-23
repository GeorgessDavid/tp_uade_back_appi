import express from 'express';
import userRoutes from './user.routes';
import pacienteRoutes from './paciente.routes';
import horarioAtencionRoutes from './horarioAtencion.routes';
import obraSocialRoutes from './obraSocial.routes';

const router = express.Router();

router.get('/status', (req,res) => res.status(200).json({status: 'OK'}));

router.use('/api', userRoutes);
router.use('/api', pacienteRoutes);
router.use('/api', horarioAtencionRoutes);
router.use('/api/obras-sociales', obraSocialRoutes);

export default router;