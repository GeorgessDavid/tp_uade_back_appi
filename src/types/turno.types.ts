export interface Turno {
    id: number;
    fecha: string;
    hora: string;
    estado: 'Solicitado' | 'Confirmado' | 'En_Espera' | 'Atendido' | 'Cancelado';
    Paciente_id: number;
    Profesional_id: number;
}

export interface CreateTurnoRequest {
    fecha: string;
    hora: string;
    Profesional_id: number;
    // Datos del paciente (si no existe, se crea)
    paciente: {
        nombre: string;
        apellido: string;
        telefono?: string;
        email?: string;
        tipoDocumento: 'LE' | 'LC' | 'DNI';
        sexo_biologico: 'Masculino' | 'Femenino';
        documento: string;
        numeroAfiliado?: string;
        ObraSocial_id?: number;
    };
}

export interface UpdateTurnoRequest {
    fecha?: string;
    hora?: string;
    estado?: 'Solicitado' | 'Confirmado' | 'En_Espera' | 'Atendido' | 'Cancelado';
}
