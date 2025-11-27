import db from '../database/models';
import { CustomError } from '../error/custom.error';
import { ObraSocial } from '../types';

const { ObraSocial: ObraSocialModel } = db;

/**
 * Servicio para obtener todas las obras sociales.
 * @returns {Promise<ObraSocial[]>} -- Lista de obras sociales.
 */

export const getAllObrasSociales = async (offset: number, limit: number): Promise<ObraSocial[]> => {
    try {
        const obrasSociales: ObraSocial[] = await ObraSocialModel.findAll({
            offset,
            limit
        })

        if (!obrasSociales || obrasSociales.length === 0) throw new CustomError(404, 'No se encontraron obras sociales');

        return obrasSociales;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener obras sociales');
    }
}

/**
 * Creación de la obra social.
 * @param nombre -- Nombre completo de la obra social.
 * @param siglas -- Siglas de la obra social.
 * @param rna -- Registro Nacional de la obra social. (Este valor es único.)
 */
export const createObrasocial = async (nombre: string, siglas: string, rna: string): Promise<ObraSocial> => {
    try {
        const obraSocialExistente = await ObraSocialModel.findOne({ where: { rna } });
        if (obraSocialExistente) throw new CustomError(400, 'El identificador RNA ya está en uso por otra obra social');

        const nuevaObraSocial: ObraSocial = await ObraSocialModel.create({ nombre, siglas, rna });
        return nuevaObraSocial;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al crear la obra social');
    }
};

/**
 * Servicio para obtener una obra social por ID.
 * @param id -- ID de la obra social.
 * @returns {Promise<ObraSocial>} -- Obra social encontrada.
 */
export const getObraSocialById = async (id: number): Promise<ObraSocial> => {
    try {
        const obraSocial: ObraSocial | null = await ObraSocialModel.findByPk(id);

        if (!obraSocial) throw new CustomError(404, 'Obra social no encontrada');

        return obraSocial;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al obtener la obra social');
    }
};

/**
 * Servicio para actualizar una obra social.
 * @param id -- ID de la obra social.
 * @param nombre -- Nombre completo de la obra social.
 * @param siglas -- Siglas de la obra social.
 * @param rna -- Registro Nacional de la obra social.
 * @returns {Promise<ObraSocial>} -- Obra social actualizada.
 */
export const updateObraSocial = async (id: number, nombre: string, siglas: string, rna: string): Promise<ObraSocial> => {
    try {
        const obraSocial: ObraSocial | null = await ObraSocialModel.findByPk(id);
        if (!obraSocial) throw new CustomError(404, 'Obra social no encontrada');

        // Verificar si el RNA ya está en uso por otra obra social
        const obraSocialConRNA = await ObraSocialModel.findOne({ where: { rna } });
        if (obraSocialConRNA && obraSocialConRNA.id !== id) {
            throw new CustomError(400, 'El identificador RNA ya está en uso por otra obra social');
        }

        await ObraSocialModel.update(
            { nombre, siglas, rna },
            { where: { id } }
        );

        const obraSocialActualizada: ObraSocial | null = await ObraSocialModel.findByPk(id);
        return obraSocialActualizada!;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al actualizar la obra social');
    }
};

/**
 * Servicio para eliminar una obra social.
 * @param id -- ID de la obra social.
 * @returns {Promise<void>}
 */
export const deleteObraSocial = async (id: number): Promise<void> => {
    try {
        const obraSocial: ObraSocial | null = await ObraSocialModel.findByPk(id);
        if (!obraSocial) throw new CustomError(404, 'Obra social no encontrada');

        await ObraSocialModel.destroy({ where: { id } });
    } catch (error) {
        if (error instanceof CustomError) throw error;
        console.error(error);
        throw new Error('Error interno del servidor al eliminar la obra social');
    }
};

