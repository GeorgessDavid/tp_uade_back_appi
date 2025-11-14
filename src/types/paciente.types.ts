export interface Paciente {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string | null;
    email: string | null;
    tipoDocumento: 'LE' | 'LC' | 'DNI';
    sexo_biologico: 'Masculino' | 'Femenino';
    documento: string | null;
    numeroAfiliado: string | null;
    ObraSocial_id: number | null;
}
