import db from '../database/models';
import { CustomError } from '../error/custom.error';
import { Paciente } from '../types/paciente.types';
import { capitalize, emailValidator } from '../utils';

const { Paciente: PacienteModel } = db;

/**
 * Servicio para buscar un paciente por documento.
 * @param {string} documento -- Documento del paciente.
 * @returns {Promise<any | null>} -- Paciente encontrado o null.
 */
export const findPacienteByDocumento = async (documento: string): Promise<any | null> => {
    try {
        const paciente = await PacienteModel.findOne({
            where: { documento },
            include: [
                {
                    association: 'obraSocial',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        return paciente;
    } catch (error) {
        console.error(error);
        throw new Error('Error interno del servidor al buscar paciente por documento');
    }
};

/**
 * Servicio para obtener todos los pacientes.
 * @returns {Promise<any[]>} -- Lista de pacientes.
 */
export const getAllPacientes = async (): Promise<any[]> => {
    try {
        const pacientes = await PacienteModel.findAll({
            include: [
                {
                    association: 'obraSocial',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        if (!pacientes || pacientes.length === 0) {
            throw new CustomError(404, 'No se encontraron pacientes');
        }

        return pacientes;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener pacientes');
    }
};

/**
 * Servicio para obtener un paciente por ID.
 * @param {number} id -- ID del paciente.
 * @returns {Promise<any>} -- Paciente encontrado.
 */
export const getPacienteById = async (id: number): Promise<any> => {
    try {
        const paciente = await PacienteModel.findByPk(id, {
            include: [
                {
                    association: 'obraSocial',
                    attributes: ['id', 'nombre']
                }
            ]
        });

        if (!paciente) {
            throw new CustomError(404, 'Paciente no encontrado');
        }

        return paciente;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener paciente');
    }
};

/**
 * Servicio para crear un nuevo paciente.
 * @param {Partial<Paciente>} pacienteData -- Datos del paciente a crear.
 * @returns {Promise<any>} -- Paciente creado.
 */
export const createPaciente = async (pacienteData: Partial<Paciente>): Promise<any> => {
    try {
        // Capitalizar nombre y apellido
        const nombreCapitalizado = capitalize(pacienteData.nombre!);
        const apellidoCapitalizado = capitalize(pacienteData.apellido!);

        // Crear paciente
        const newPaciente = await PacienteModel.create({
            ...pacienteData,
            nombre: nombreCapitalizado,
            apellido: apellidoCapitalizado
        });

        return newPaciente;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al crear paciente');
    }
};

/**
 * Servicio para actualizar un paciente existente.
 * @param {number} id -- ID del paciente a actualizar.
 * @param {Partial<Paciente>} pacienteData -- Datos a actualizar.
 * @returns {Promise<any>} -- Paciente actualizado.
 */
export const updatePaciente = async (id: number, pacienteData: Partial<Paciente>): Promise<any> => {
    try {
        const paciente: any = await PacienteModel.findByPk(id);

        if (!paciente) {
            throw new CustomError(404, 'Paciente no encontrado');
        }

        // Capitalizar nombre y apellido si se proporcionan
        if (pacienteData.nombre) {
            pacienteData.nombre = capitalize(pacienteData.nombre);
        }
        if (pacienteData.apellido) {
            pacienteData.apellido = capitalize(pacienteData.apellido);
        }

        await paciente.update(pacienteData);

        return paciente;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al actualizar paciente');
    }
};

/**
 * Servicio para eliminar un paciente.
 * @param {number} id -- ID del paciente a eliminar.
 * @returns {Promise<void>}
 */
export const deletePaciente = async (id: number): Promise<void> => {
    try {
        const paciente: any = await PacienteModel.findByPk(id);

        if (!paciente) {
            throw new CustomError(404, 'Paciente no encontrado');
        }

        await paciente.destroy();
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al eliminar paciente');
    }
};
