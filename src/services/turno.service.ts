import db from '../database/models';
import { CustomError } from '../error/custom.error';
import { Turno, CreateTurnoRequest, UpdateTurnoRequest, Paciente } from '../types';
import { Op } from 'sequelize';
import * as PacienteService from './paciente.service';
import * as nodemailer from '../api/nodemailer';
import { isDateWithinRange } from '../utils';

const { Turno: TurnoModel, Paciente: PacienteModel, Usuario: UsuarioModel, HorarioAtencion: HorarioAtencionModel } = db;

/**
 * Servicio para buscar o crear un paciente.
 * Reutiliza los servicios de paciente para mantener consistencia.
 * Si existe un paciente con el mismo documento, lo retorna.
 * Si no existe, lo crea con los datos proporcionados.
 */
const findOrCreatePaciente = async (pacienteData: Paciente): Promise<Paciente> => {
    try {
        // Buscar paciente por documento usando el servicio
        let paciente = await PacienteService.findPacienteByDocumento(pacienteData.documento!);

        // Si no existe, crear el paciente usando el servicio
        if (!paciente) {
            console.log('Paciente no encontrado, creando nuevo paciente...');
            paciente = await PacienteService.createPaciente(pacienteData);
        }

        return paciente;
    } catch (error) {
        console.error(error);
        throw new Error('Error al buscar o crear paciente');
    }
};

/**
 * Servicio para validar disponibilidad de un turno.
 * Verifica que no exista un turno activo en esa fecha/hora para el profesional.
 */
const validarDisponibilidad = async (fecha: string, hora: string, Profesional_id: number, excludeTurnoId?: number): Promise<void> => {
    try {
        const whereClause: any = {
            fecha,
            hora,
            Profesional_id,
            estado: ['Solicitado', 'Confirmado', 'En_Espera', 'Atendido'] // No incluir Cancelado
        };

        // Si estamos actualizando, excluir el turno actual
        if (excludeTurnoId) {
            whereClause.id = { [Op.ne]: excludeTurnoId };
        }

        const turnoExistente = await TurnoModel.findOne({ where: whereClause });

        if (turnoExistente) {
            throw new CustomError(400, 'El turno en esa fecha y hora ya está ocupado');
        }
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error al validar disponibilidad del turno');
    }
};

/**
 * Servicio para validar que la fecha/hora esté dentro de los horarios de atención.
 */
const validarHorarioAtencion = async (fecha: string, hora: string, Profesional_id: number): Promise<void> => {
    try {
        // Obtener día de la semana
        const fechaObj = new Date(fecha + 'T00:00:00');
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaSemana = diasSemana[fechaObj.getDay()];

        // Buscar horario de atención para ese día
        const horario = await HorarioAtencionModel.findOne({
            where: {
                Profesional_id,
                dia: diaSemana
            }
        });

        if (!horario) {
            throw new CustomError(400, `El profesional no atiende los días ${diaSemana}`);
        }

        // Validar que la hora esté dentro del rango
        if (hora < horario.horaInicio || hora >= horario.horaFin) {
            throw new CustomError(400, `La hora seleccionada está fuera del horario de atención (${horario.horaInicio} - ${horario.horaFin})`);
        }
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error al validar horario de atención');
    }
};

/**
 * Servicio para crear un nuevo turno.
 * Busca o crea el paciente automáticamente usando el documento.
 */
export const createTurno = async (turnoData: CreateTurnoRequest): Promise<Turno> => {
    try {
        const { fecha, hora, Profesional_id, paciente: pacienteData } = turnoData;

        // Validar que la fecha esté dentro del rango permitido (2 semanas)
        const validacionFecha = isDateWithinRange(fecha, 2);
        if (!validacionFecha.valido) {
            throw new CustomError(400, validacionFecha.mensaje);
        }

        // Validar que el profesional existe
        const profesional = await UsuarioModel.findByPk(Profesional_id);
        if (!profesional) {
            throw new CustomError(404, 'Profesional no encontrado');
        }

        // Validar horario de atención
        await validarHorarioAtencion(fecha, hora, Profesional_id);

        // Validar disponibilidad
        await validarDisponibilidad(fecha, hora, Profesional_id);

        // Buscar o crear paciente
        const paciente = await findOrCreatePaciente(pacienteData);

        // Crear el turno
        const nuevoTurno = await TurnoModel.create({
            fecha,
            hora,
            Profesional_id,
            Paciente_id: paciente.id,
            estado: 'Solicitado'
        });

        const { nombre, apellido, email } = paciente;

        // Enviar notificación de nuevo turno
        await nodemailer.notifyNewAppointment(nombre + ' ' + apellido, email!, fecha, hora);

        return nuevoTurno;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al crear turno');
    }
};

/**
 * Servicio para obtener todos los turnos con filtros opcionales.
 */
export const getAllTurnos = async (
    offset: number = 0,
    limit: number = 10,
    filters?: {
        fecha?: string;
        Profesional_id?: number;
        Paciente_id?: number;
        estado?: string;
    }
): Promise<Turno[]> => {
    try {
        const whereClause: any = {};

        if (filters?.fecha) whereClause.fecha = filters.fecha;
        if (filters?.Profesional_id) whereClause.Profesional_id = filters.Profesional_id;
        if (filters?.Paciente_id) whereClause.Paciente_id = filters.Paciente_id;
        if (filters?.estado) whereClause.estado = filters.estado;

        const turnos = await TurnoModel.findAll({
            where: whereClause,
            include: [
                {
                    model: PacienteModel,
                    as: 'paciente',
                    include: [
                        {
                            model: db.ObraSocial,
                            as: 'obraSocial'
                        }
                    ]
                },
                {
                    model: UsuarioModel,
                    as: 'profesional',
                    attributes: { exclude: ['contrasena'] }
                }
            ],
            offset,
            limit,
            order: [['fecha', 'DESC'], ['hora', 'DESC']]
        });

        if (!turnos || turnos.length === 0) {
            throw new CustomError(404, 'No se encontraron turnos');
        }

        return turnos;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener turnos');
    }
};

/**
 * Servicio para obtener un turno por ID.
 */
export const getTurnoById = async (id: number): Promise<Turno> => {
    try {
        const turno = await TurnoModel.findByPk(id, {
            include: [
                {
                    model: PacienteModel,
                    as: 'paciente',
                    include: [
                        {
                            model: db.ObraSocial,
                            as: 'obraSocial'
                        }
                    ]
                },
                {
                    model: UsuarioModel,
                    as: 'profesional',
                    attributes: { exclude: ['contrasena'] }
                }
            ]
        });

        if (!turno) {
            throw new CustomError(404, 'Turno no encontrado');
        }

        return turno;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener turno');
    }
};

/**
 * Servicio para actualizar un turno.
 */
export const updateTurno = async (id: number, updateData: UpdateTurnoRequest): Promise<Turno> => {
    try {
        const turno = await TurnoModel.findByPk(id, {
            include: [
                {
                    association: 'paciente',
                    attributes: ['nombre', 'apellido', 'email']
                },
                {
                    association: 'profesional',
                    attributes: ['nombre', 'apellido']
                }
            ]
        });

        if (!turno) {
            throw new CustomError(404, 'Turno no encontrado');
        }

        // Si se actualiza fecha u hora, validar disponibilidad
        if (updateData.fecha || updateData.hora) {
            const nuevaFecha = updateData.fecha || turno.fecha;
            const nuevaHora = updateData.hora || turno.hora;
            
            await validarHorarioAtencion(nuevaFecha, nuevaHora, turno.Profesional_id);
            await validarDisponibilidad(nuevaFecha, nuevaHora, turno.Profesional_id, id);
        }
        
        // Actualizar turno
        await TurnoModel.update(updateData, { where: { id } });

        // Retornar turno actualizado
        const turnoActualizado = await getTurnoById(id);

        const { nombre, apellido, email } = turno.paciente;

        // Enviar notificación si el estado cambió a Confirmado
        if (turnoActualizado.estado === 'Confirmado') nodemailer.notifyAppointmentConfirmed(nombre + ' ' + apellido, email!, turnoActualizado.fecha, turnoActualizado.hora, turno.profesional.nombre + ' ' + turno.profesional.apellido);
        
        return turnoActualizado;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al actualizar turno');
    }
};

/**
 * Servicio para eliminar un turno (soft delete).
 */
export const deleteTurno = async (id: number): Promise<void> => {
    try {
        const turno = await TurnoModel.findByPk(id);
        if (!turno) {
            throw new CustomError(404, 'Turno no encontrado');
        }

        // Soft delete
        await TurnoModel.destroy({ where: { id } });
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al eliminar turno');
    }
};

/**
 * Servicio para cancelar un turno (cambiar estado a Cancelado).
 */
export const cancelTurno = async (id: number): Promise<Turno> => {
    try {
        const turno = await TurnoModel.findByPk(id);
        if (!turno) {
            throw new CustomError(404, 'Turno no encontrado');
        }

        if (turno.estado === 'Cancelado') {
            throw new CustomError(400, 'El turno ya está cancelado');
        }

        if (turno.estado === 'Atendido') {
            throw new CustomError(400, 'No se puede cancelar un turno ya atendido');
        }

        await TurnoModel.update({ estado: 'Cancelado' }, { where: { id } });

        const turnoActualizado = await getTurnoById(id);
        return turnoActualizado;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al cancelar turno');
    }
};
