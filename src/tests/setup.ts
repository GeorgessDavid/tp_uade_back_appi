// Setup básico para tests unitarios
// Mock para nodemailer
jest.mock('../api/nodemailer', () => ({
  notifyNewAppointment: jest.fn(),
  notifyAppointmentConfirmed: jest.fn(),
}));

// Mock para base de datos para evitar conexiones reales
jest.mock('../database/models', () => ({}));