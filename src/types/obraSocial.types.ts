import { Usuario, Paciente } from './index';

export interface ObraSocial {
    id: number;
    nombre: string;
    siglas: string;
    rna: string;
    profesionales?: Partial<Usuario>[];
    pacientes?: Partial<Paciente>[]
}