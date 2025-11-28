import { CustomError } from '../error/custom.error';

describe('Tests de CustomError', () => {
  describe('Clase CustomError', () => {
    it('debería crear error con status y mensaje', () => {
      const error = new CustomError(400, 'Solicitud incorrecta');
      
      expect(error.status).toBe(400);
      expect(error.message).toBe('Solicitud incorrecta');
      expect(error.errors).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomError);
    });

    it('debería crear error con status, mensaje y array de errores', () => {
      const errors = [
        { field: 'email', message: 'Formato de email inválido' },
        { field: 'password', message: 'Contraseña muy corta' }
      ];
      
      const error = new CustomError(422, 'Validación fallida', errors);
      
      expect(error.status).toBe(422);
      expect(error.message).toBe('Validación fallida');
      expect(error.errors).toEqual(errors);
    });

    it('debería manejar diferentes códigos de estado', () => {
      const error401 = new CustomError(401, 'No autorizado');
      const error404 = new CustomError(404, 'No encontrado');
      const error500 = new CustomError(500, 'Error interno del servidor');
      
      expect(error401.status).toBe(401);
      expect(error404.status).toBe(404);
      expect(error500.status).toBe(500);
    });

    it('debería preservar el stack trace', () => {
      const error = new CustomError(400, 'Error de prueba');
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('debería ser lanzable y capturable', () => {
      expect(() => {
        throw new CustomError(400, 'Error de prueba');
      }).toThrow(CustomError);

      try {
        throw new CustomError(404, 'Recurso no encontrado');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).status).toBe(404);
        expect((error as CustomError).message).toBe('Recurso no encontrado');
      }
    });
  });
});