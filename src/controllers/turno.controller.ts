const { validationResult } = require('express-validator');
import { Request, Response } from 'express';
import { CustomError } from '../error/custom.error';
import * as TurnoService from '../services/turno.service';

/**
 * Controlador para crear un nuevo turno.
 * Valida datos y busca/crea paciente automáticamente.
 */
export const createTurno = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const nuevoTurno = await TurnoService.createTurno(req.body);

        return res.status(201).json({
            message: 'Turno creado exitosamente',
            data: nuevoTurno
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
 * Controlador para obtener todos los turnos con filtros opcionales.
 */
export const getAllTurnos = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        const filters = {
            fecha: req.query.fecha as string,
            Profesional_id: req.query.Profesional_id ? parseInt(req.query.Profesional_id as string) : undefined,
            Paciente_id: req.query.Paciente_id ? parseInt(req.query.Paciente_id as string) : undefined,
            estado: req.query.estado as string,
        };

        const turnos = await TurnoService.getAllTurnos(offset, limit, filters);

        return res.status(200).json({
            message: 'Turnos obtenidos exitosamente',
            data: turnos
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
 * Controlador para obtener un turno por ID.
 */
export const getTurnoById = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const turno = await TurnoService.getTurnoById(parseInt(id));

        return res.status(200).json({
            message: 'Turno obtenido exitosamente',
            data: turno
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
 * Controlador para actualizar un turno.
 */
export const updateTurno = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const turnoActualizado = await TurnoService.updateTurno(parseInt(id), req.body);

        return res.status(200).json({
            message: 'Turno actualizado exitosamente',
            data: turnoActualizado
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
 * Controlador para eliminar un turno (soft delete).
 */
export const deleteTurno = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        await TurnoService.deleteTurno(parseInt(id));

        return res.status(200).json({
            message: 'Turno eliminado exitosamente'
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
 * Controlador para cancelar un turno.
 */
export const cancelTurno = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const turnoCancelado = await TurnoService.cancelTurno(parseInt(id));

        return res.status(200).json({
            message: 'Turno cancelado exitosamente',
            data: turnoCancelado
        });
    } catch (error) {
        if (error instanceof CustomError) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
