/**
 * Valida si una fecha está dentro de un rango de tiempo permitido desde hoy.
 * 
 * @param {string} fechaString - Fecha a validar en formato 'YYYY-MM-DD'
 * @param {number} limiteSemanas - Número de semanas máximo hacia adelante (por defecto 2)
 * @param {number} limiteDias - Número de días máximo hacia adelante (opcional, tiene prioridad sobre semanas)
 * @returns {{ valido: boolean, mensaje: string }} - Objeto con validación y mensaje descriptivo
 * 
 * @example
 * // Validar fecha dentro de 2 semanas
 * const resultado = isDateWithinRange('2025-12-10', 2);
 * if (!resultado.valido) {
 *   throw new Error(resultado.mensaje);
 * }
 * 
 * @example
 * // Validar fecha dentro de 30 días
 * const resultado = isDateWithinRange('2025-12-25', undefined, 30);
 */
export const isDateWithinRange = (
    fechaString: string, 
    limiteSemanas: number = 2, 
    limiteDias?: number
): { valido: boolean; mensaje: string } => {
    try {
        // Fecha actual (solo día, sin horas)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Fecha solicitada
        const fechaSolicitada = new Date(fechaString + 'T00:00:00');
        
        // Validar que la fecha sea válida
        if (isNaN(fechaSolicitada.getTime())) {
            return {
                valido: false,
                mensaje: 'La fecha proporcionada no es válida'
            };
        }

        // No permitir fechas en el pasado
        if (fechaSolicitada < hoy) {
            return {
                valido: false,
                mensaje: 'No se pueden reservar turnos en fechas pasadas'
            };
        }

        // Calcular fecha límite
        const fechaLimite = new Date(hoy);
        if (limiteDias !== undefined) {
            fechaLimite.setDate(fechaLimite.getDate() + limiteDias);
        } else {
            fechaLimite.setDate(fechaLimite.getDate() + (limiteSemanas * 7));
        }

        // Validar que esté dentro del rango
        if (fechaSolicitada > fechaLimite) {
            const rangoTexto = limiteDias !== undefined 
                ? `${limiteDias} día${limiteDias > 1 ? 's' : ''}`
                : `${limiteSemanas} semana${limiteSemanas > 1 ? 's' : ''}`;
            
            return {
                valido: false,
                mensaje: `Solo se pueden reservar turnos con hasta ${rangoTexto} de anticipación`
            };
        }

        // Todo OK
        return {
            valido: true,
            mensaje: 'La fecha está dentro del rango permitido'
        };

    } catch (error) {
        return {
            valido: false,
            mensaje: 'Error al validar la fecha'
        };
    }
};

/**
 * Versión simplificada que solo retorna true/false
 * @param {string} fechaString - Fecha a validar en formato 'YYYY-MM-DD'
 * @param {number} limiteSemanas - Número de semanas máximo hacia adelante
 * @returns {boolean} - true si está dentro del rango, false si no
 */
export const isWithinTwoWeeks = (fechaString: string, limiteSemanas: number = 2): boolean => {
    return isDateWithinRange(fechaString, limiteSemanas).valido;
};
