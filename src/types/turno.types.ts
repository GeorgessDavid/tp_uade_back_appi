import { Paciente } from './paciente.types';
export interface Turno {
    id: number;
    fecha: string;
    hora: string;
    estado: 'Solicitado' | 'Confirmado' | 'En_Espera' | 'Atendido' | 'Cancelado' | 'Ausente';
    Paciente_id: number;
    Profesional_id: number;
}

export interface CreateTurnoRequest {
    fecha: string;
    hora: string;
    Profesional_id: number;
    // Datos del paciente (si no existe, se crea)
    paciente: Paciente;
}

export interface UpdateTurnoRequest {
    fecha?: string;
    hora?: string;
    estado?: 'Solicitado' | 'Confirmado' | 'En_Espera' | 'Atendido' | 'Cancelado' | 'Ausente';
}
