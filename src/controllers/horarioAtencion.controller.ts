const { validationResult } = require("express-validator");
import { Request, Response } from "express";
import { CustomError } from "../error/custom.error";
import * as service from '../services/horarioAtencion.service';

export const getAllHorariosAtencion = async (req: Request, res: Response) => {
    try {
        const horarios = await service.getAllHorariosAtencion();
        res.status(200).json({ message: 'Horarios de atención obtenidos exitosamente', horarios });
    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getHorarioAtencionById = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;
        const horario = await service.getHorarioAtencionById(Number(id));

        res.status(200).json({ message: 'Horario de atención obtenido exitosamente', horario });
    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createHorarioAtencion = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { dia, horaInicio, horaFin, intervalo, Profesional_id } = req.body;
        const horario = await service.createHorarioAtencion({ dia, horaInicio, horaFin, intervalo, Profesional_id });

        res.status(201).json({ message: 'Horario de atención creado exitosamente', horario });
    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateHorarioAtencion = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;
        const horario = await service.updateHorarioAtencion(Number(id), req.body);

        res.status(200).json({ message: 'Horario de atención actualizado exitosamente', horario });
    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteHorarioAtencion = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;
        await service.deleteHorarioAtencion(Number(id));

        res.status(200).json({ message: 'Horario de atención eliminado exitosamente' });
    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const calcularSlotsDisponibles = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new CustomError(400, 'Errores de validación', errors.array());

        const { id } = req.params;
        const { fecha } = req.query;

        const slots = await service.calcularSlotsDisponibles(Number(id), fecha as string);

        res.status(200).json({ message: 'Slots calculados exitosamente', slots });
    } catch (error) {
        if (error instanceof CustomError) res.status(error.status).json({ message: error.message, errors: error.errors });
        else res.status(500).json({ message: 'Error interno del servidor' });
    }
};
