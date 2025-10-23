-- -----------------------------------------------------
-- CREACIÓN DE BASE DE DATOS
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS consultorio_medico
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE consultorio_medico;

-- -----------------------------------------------------
-- TABLA: Rol
-- -----------------------------------------------------
CREATE TABLE Rol (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: Usuario
-- -----------------------------------------------------
CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,              -- hash bcrypt
  email VARCHAR(150) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  sexo_biologico ENUM('Masculino', 'Femenino') NOT NULL,
  Rol_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_rol FOREIGN KEY (Rol_id) REFERENCES Rol(id)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: ObraSocial
-- -----------------------------------------------------
CREATE TABLE ObraSocial (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: Paciente
-- -----------------------------------------------------
CREATE TABLE Paciente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(40),
  email VARCHAR(150),
  tipoDocumento ENUM('LE', 'LC', 'DNI') DEFAULT 'DNI',
  sexo_biologico ENUM('Masculino', 'Femenino') NOT NULL,
  documento VARCHAR(30),
  numeroAfiliado VARCHAR(60),
  ObraSocial_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_paciente_obrasocial FOREIGN KEY (ObraSocial_id) REFERENCES ObraSocial(id),
  INDEX ix_paciente_nombre (apellido, nombre)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: HorarioAtencion
-- -----------------------------------------------------
CREATE TABLE HorarioAtencion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado') NOT NULL,
  horaInicio TIME NOT NULL,
  horaFin TIME NOT NULL,
  intervalo INT NOT NULL,                       -- en minutos
  Profesional_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_horario_profesional FOREIGN KEY (Profesional_id) REFERENCES Usuario(id),
  INDEX ix_horario_dia (dia)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: Turno
-- -----------------------------------------------------
CREATE TABLE Turno (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('Solicitado','Confirmado','En_Espera','Atendido','Cancelado') DEFAULT 'Solicitado',
  Paciente_id INT NOT NULL,
  Profesional_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_turno_paciente FOREIGN KEY (Paciente_id) REFERENCES Paciente(id),
  CONSTRAINT fk_turno_profesional FOREIGN KEY (Profesional_id) REFERENCES Usuario(id),
  UNIQUE KEY uq_turno_profesional_fecha_hora (Profesional_id, fecha, hora),
  INDEX ix_turno_fecha (fecha),
  INDEX ix_turno_estado (estado)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: ProfesionalObraSocial
-- -----------------------------------------------------
CREATE TABLE ProfesionalObraSocial (
  Profesional_id INT NOT NULL,
  ObraSocial_id INT NOT NULL,
  PRIMARY KEY (Profesional_id, ObraSocial_id),
  CONSTRAINT fk_pos_profesional FOREIGN KEY (Profesional_id) REFERENCES Usuario(id) ON DELETE CASCADE,
  CONSTRAINT fk_pos_obrasocial  FOREIGN KEY (ObraSocial_id)  REFERENCES ObraSocial(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- DATOS INICIALES
-- -----------------------------------------------------

-- Roles
INSERT INTO Rol (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Medico', 'Profesional que atiende pacientes'),
('Secretaria', 'Gestiona turnos y agenda');

-- Usuarios
INSERT INTO Usuario (username, password, email, nombre, apellido, sexo, Rol_id) VALUES
('admin', '$2b$10$hash_admin', 'admin@consultorio.com', 'Administrador', 'Principal', 'M', 1),
('drgomez', '$2b$10$hash_medico', 'drgomez@consultorio.com', 'Carlos', 'Gómez', 'M', 2),
('secretaria1', '$2b$10$hash_secretaria', 'secretaria@consultorio.com', 'María', 'López', 'F', 3);

-- Obras Sociales
INSERT INTO ObraSocial (nombre) VALUES
('OSDE'),
('Swiss Medical'),
('Galeno');

-- Pacientes
INSERT INTO Paciente (nombre, apellido, telefono, email, tipoDocumento, documento, numeroAfiliado, ObraSocial_id) VALUES
('Julián', 'Pérez', '1123456789', 'julianperez@mail.com', 'DNI', '12345678', 'A001', 1),
('María', 'Torres', '1198765432', 'mariatorres@mail.com', 'DNI', '22334455', 'B002', 2),
('Lucía', 'González', '1176543210', 'luciagonzalez@mail.com', 'DNI', '33445566', 'C003', 3);

-- Horarios del médico
INSERT INTO HorarioAtencion (dia, horaInicio, horaFin, intervalo, Profesional_id) VALUES
('Lunes', '08:00:00', '12:00:00', 30, 2),
('Miércoles', '08:00:00', '12:00:00', 30, 2),
('Viernes', '14:00:00', '18:00:00', 30, 2);

-- Convenios médico–obra social
INSERT INTO ProfesionalObraSocial (Profesional_id, ObraSocial_id) VALUES
(2, 1),
(2, 2),
(2, 3);

-- Turnos iniciales
INSERT INTO Turno (fecha, hora, estado, Paciente_id, Profesional_id) VALUES
('2025-10-24', '08:00:00', 'Solicitado', 1, 2),
('2025-10-24', '08:30:00', 'Confirmado', 2, 2),
('2025-10-25', '09:00:00', 'En_Espera', 3, 2);
