import express from 'express';
import userRoutes from './user.routes';
import pacienteRoutes from './paciente.routes';
import horarioAtencionRoutes from './horarioAtencion.routes';
import obraSocialRoutes from './obraSocial.routes';
import turnoRoutes from './turno.routes';

const router = express.Router();

router.get('/status', (req,res) => res.status(200).json({status: 'OK'}));

router.use('/api/users', userRoutes);
router.use('/api/pacientes', pacienteRoutes);
router.use('/api/horarios-atencion', horarioAtencionRoutes);
router.use('/api/obras-sociales', obraSocialRoutes);
router.use('/api/turnos', turnoRoutes);

export default router;