const { validationResult } = require('express-validator');
import { Request, Response } from 'express';
import { CustomError } from '../error/custom.error';
import * as service from '../services/paciente.service';

export const getAllPacientes = async (req: Request, res: Response) => {
    try {
        const pacientes = await service.getAllPacientes();

        res.status(200).json({ message: 'Pacientes obtenidos exitosamente', pacientes });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

export const getPacienteById = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;

        const paciente = await service.getPacienteById(Number(id));

        res.status(200).json({ message: 'Paciente obtenido exitosamente', paciente });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

export const createPaciente = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const pacienteData = req.body;

        const newPaciente = await service.createPaciente(pacienteData);

        res.status(201).json({ message: 'Paciente creado exitosamente', paciente: newPaciente });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

export const updatePaciente = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;
        const pacienteData = req.body;

        const updatedPaciente = await service.updatePaciente(Number(id), pacienteData);

        res.status(200).json({ message: 'Paciente actualizado exitosamente', paciente: updatedPaciente });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};

export const deletePaciente = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;

        await service.deletePaciente(Number(id));

        res.status(200).json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ message: error.message, errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
};
