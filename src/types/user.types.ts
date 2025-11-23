export interface Usuario{
    id: number;
    usuario: string;
    contrasena: string;
    email: string;
    nombre: string;
    apellido: string;
    sexo_biologico: 'Masculino' | 'Femenino';
    Rol_id: number;
}