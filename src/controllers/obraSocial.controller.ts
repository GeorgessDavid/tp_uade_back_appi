const { validationResult } = require('express-validator');
import { Request, Response } from 'express';
import { CustomError } from '../error/custom.error';
import * as ObraSocialService from '../services/obraSocial.service';

/**
 * Controlador para obtener todas las obras sociales con paginación.
 */
export const getAllObrasSociales = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        const obrasSociales = await ObraSocialService.getAllObrasSociales(offset, limit);

        return res.status(200).json({
            message: 'Obras sociales obtenidas exitosamente',
            data: obrasSociales
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una obra social por ID.
 */
export const getObraSocialById = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const obraSocial = await ObraSocialService.getObraSocialById(parseInt(id));

        return res.status(200).json({
            message: 'Obra social obtenida exitosamente',
            data: obraSocial
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Controlador para crear una nueva obra social.
 */
export const createObraSocial = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nombre, siglas, rna } = req.body;
        const nuevaObraSocial = await ObraSocialService.createObrasocial(nombre, siglas, rna);

        return res.status(201).json({
            message: 'Obra social creada exitosamente',
            data: nuevaObraSocial
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una obra social existente.
 */
export const updateObraSocial = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nombre, siglas, rna } = req.body;
        
        const obraSocialActualizada = await ObraSocialService.updateObraSocial(
            parseInt(id),
            nombre,
            siglas,
            rna
        );

        return res.status(200).json({
            message: 'Obra social actualizada exitosamente',
            data: obraSocialActualizada
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una obra social.
 */
export const deleteObraSocial = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        await ObraSocialService.deleteObraSocial(parseInt(id));

        return res.status(200).json({
            message: 'Obra social eliminada exitosamente'
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
