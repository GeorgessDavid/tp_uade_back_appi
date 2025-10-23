/**
 * Custom Error Class
 * Permite crear errores personalizados con estado HTTP y mensajes específicos.
 * Utilizado para manejar errores de manera consistente en la aplicación.
 * @param {number} status - Código de estado HTTP.
 * @param {string} message - Mensaje descriptivo del error.
 * @param {Array<object>} [errors] - Detalles adicionales del error (opcional).
 */
export class CustomError extends Error {
    public status: number;
    public message: string;
    public errors?: Array<object>;

    constructor(status: number, message: string, errors?: Array<object>) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}