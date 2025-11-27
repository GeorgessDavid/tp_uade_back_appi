import db from '../database/models';
import { CustomError } from '../error/custom.error';
import { HorarioAtencion } from '../types';

const { HorarioAtencion: HorarioAtencionModel } = db;

/**
 * Servicio para obtener todos los horarios de atención.
 * @returns {Promise<HorarioAtencion[]>} -- Lista de horarios de atención.
 */
export const getAllHorariosAtencion = async (): Promise<HorarioAtencion[]> => {
    try {
        const horarios: HorarioAtencion[] = await HorarioAtencionModel.findAll({
            include: [{
                association: 'profesional',
                attributes: ['id', 'nombre', 'apellido', 'email']
            }]
        });

        if (!horarios || horarios.length === 0) {
            throw new CustomError(404, 'No se encontraron horarios de atención');
        }

        return horarios;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener horarios de atención');
    }
};

/**
 * Servicio para obtener un horario de atención por ID.
 * @param {number} id -- ID del horario de atención.
 * @returns {Promise<HorarioAtencion>} -- Horario de atención encontrado.
 */
export const getHorarioAtencionById = async (id: number): Promise<HorarioAtencion> => {
    try {
        const horario: HorarioAtencion = await HorarioAtencionModel.findByPk(id, {
            include: [{
                association: 'profesional',
                attributes: ['id', 'nombre', 'apellido', 'email']
            }]
        });

        if (!horario) {
            throw new CustomError(404, 'Horario de atención no encontrado');
        }

        return horario;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener el horario de atención');
    }
};

/**
 * Servicio para crear un nuevo horario de atención.
 * @param {Partial<HorarioAtencion>} data -- Datos del horario de atención.
 * @returns {Promise<HorarioAtencion>} -- Horario de atención creado.
 */
export const createHorarioAtencion = async (data: Partial<HorarioAtencion>): Promise<HorarioAtencion> => {
    try {
        // Verificar que el profesional existe
        const profesional = await db.Usuario.findByPk(data.Profesional_id);
        if (!profesional) {
            throw new CustomError(404, 'El profesional especificado no existe');
        }

        const horario: HorarioAtencion = await HorarioAtencionModel.create(data);
        return horario;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al crear el horario de atención');
    }
};

/**
 * Servicio para actualizar un horario de atención existente.
 * @param {number} id -- ID del horario de atención.
 * @param {Partial<HorarioAtencion>} data -- Datos a actualizar.
 * @returns {Promise<HorarioAtencion>} -- Horario de atención actualizado.
 */
export const updateHorarioAtencion = async (id: number, data: Partial<HorarioAtencion>): Promise<HorarioAtencion> => {
    try {
        const horario = await HorarioAtencionModel.findByPk(id);
        if (!horario) {
            throw new CustomError(404, 'Horario de atención no encontrado');
        }

        // Si se actualiza el profesional, verificar que existe
        if (data.Profesional_id) {
            const profesional = await db.Usuario.findByPk(data.Profesional_id);
            if (!profesional) {
                throw new CustomError(404, 'El profesional especificado no existe');
            }
        }

        await horario.update(data);
        return horario;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al actualizar el horario de atención');
    }
};

/**
 * Servicio para eliminar un horario de atención.
 * @param {number} id -- ID del horario de atención.
 * @returns {Promise<void>}
 */
export const deleteHorarioAtencion = async (id: number): Promise<void> => {
    try {
        const horario = await HorarioAtencionModel.findByPk(id);
        if (!horario) {
            throw new CustomError(404, 'Horario de atención no encontrado');
        }

        await horario.destroy();
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al eliminar el horario de atención');
    }
};

/**
 * Servicio para calcular los slots de turnos disponibles según el horario de atención.
 * @param {number} horarioId -- ID del horario de atención.
 * @param {string} fecha -- Fecha en formato YYYY-MM-DD para calcular los slots.
 * @returns {Promise<string[]>} -- Array de horarios disponibles en formato HH:MM:SS.
 */
export const calcularSlotsDisponibles = async (horarioId: number, fecha: string): Promise<string[]> => {
    try {
        const horario = await HorarioAtencionModel.findByPk(horarioId);
        if (!horario) {
            throw new CustomError(404, 'Horario de atención no encontrado');
        }

        // Calcular todos los slots posibles según horaInicio, horaFin e intervalo
        const slots: string[] = [];
        const [horaIni, minIni] = horario.horaInicio.split(':').map(Number);
        const [horaFin, minFin] = horario.horaFin.split(':').map(Number);

        let minutoActual = horaIni * 60 + minIni;
        const minutoFinal = horaFin * 60 + minFin;

        // El último turno posible es: horaFin - intervalo
        while (minutoActual + horario.intervalo <= minutoFinal) {
            const horas = Math.floor(minutoActual / 60);
            const minutos = minutoActual % 60;
            slots.push(`${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:00`);
            minutoActual += horario.intervalo;
        }

        // Filtrar slots ya ocupados por turnos en esa fecha
        const turnosOcupados = await db.Turno.findAll({
            where: {
                Profesional_id: horario.Profesional_id,
                fecha: fecha,
                estado: ['Solicitado', 'Confirmado', 'En_Espera', 'Atendido']
            },
            attributes: ['hora']
        });

        const horasOcupadas = turnosOcupados.map((t: any) => t.hora);
        const slotsDisponibles = slots.filter(slot => !horasOcupadas.includes(slot));

        return slotsDisponibles;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error al calcular slots disponibles');
    }
};
