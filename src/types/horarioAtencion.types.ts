export interface HorarioAtencion {
    id: number;
    dia: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
    horaInicio: string;
    horaFin: string;
    intervalo: number;
    Profesional_id: number;
}
