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
  usuario VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,              -- hash bcrypt
  email VARCHAR(150) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  sexo_biologico ENUM('Masculino', 'Femenino') NOT NULL,
  Rol_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL DEFAULT NULL COMMENT 'Soft delete (NULL = activo)',
  CONSTRAINT fk_usuario_rol FOREIGN KEY (Rol_id) REFERENCES Rol(id)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: ObraSocial
-- -----------------------------------------------------
CREATE TABLE ObraSocial (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE,
  siglas VARCHAR(20) NOT NULL UNIQUE,
  rna VARCHAR(50) NOT NULL UNIQUE COMMENT 'Registro Nacional de Obras Sociales',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL DEFAULT NULL COMMENT 'Soft delete (NULL = activo)',
  INDEX ix_obrasocial_nombre (nombre)
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
  deleted_at DATETIME NULL DEFAULT NULL COMMENT 'Soft delete (NULL = activo)',
  CONSTRAINT fk_paciente_obrasocial FOREIGN KEY (ObraSocial_id) REFERENCES ObraSocial(id),
  INDEX ix_paciente_nombre (apellido, nombre),
  INDEX ix_paciente_documento (documento)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: HorarioAtencion
-- -----------------------------------------------------
CREATE TABLE HorarioAtencion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado') NOT NULL,
  horaInicio TIME NOT NULL,
  horaFin TIME NOT NULL,
  intervalo INT NOT NULL COMMENT 'Intervalo en minutos entre turnos',
  Profesional_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL DEFAULT NULL COMMENT 'Soft delete (NULL = activo)',
  CONSTRAINT fk_horario_profesional FOREIGN KEY (Profesional_id) REFERENCES Usuario(id),
  INDEX ix_horario_dia (dia),
  INDEX ix_horario_profesional (Profesional_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- TABLA: Turno
-- -----------------------------------------------------
CREATE TABLE Turno (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('Solicitado','Confirmado','En_Espera','Atendido','Cancelado','Ausente') DEFAULT 'Solicitado',
  Paciente_id INT NOT NULL,
  Profesional_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL DEFAULT NULL COMMENT 'Soft delete (NULL = activo)',
  CONSTRAINT fk_turno_paciente FOREIGN KEY (Paciente_id) REFERENCES Paciente(id),
  CONSTRAINT fk_turno_profesional FOREIGN KEY (Profesional_id) REFERENCES Usuario(id),
  UNIQUE KEY uq_turno_profesional_fecha_hora (Profesional_id, fecha, hora),
  INDEX ix_turno_fecha (fecha),
  INDEX ix_turno_estado (estado),
  INDEX ix_turno_paciente (Paciente_id)
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
INSERT INTO `rol` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
	(1, 'Administrador', '2025-11-27 15:57:42', '2025-11-27 15:57:42'),
	(2, 'Medico', '2025-11-27 15:57:42', '2025-11-27 15:57:42'),
	(3, 'Secretaria', '2025-11-27 15:57:42', '2025-11-27 15:57:42');

-- Usuarios (contraseñas hasheadas con bcrypt)
INSERT INTO `usuario` (`id`, `usuario`, `contrasena`, `email`, `nombre`, `apellido`, `sexo_biologico`, `Rol_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'masuarez', '$2b$10$ielhEwR.cArwgivrPLJYeOe2KyOaEdtc7X3f9wgupg6.3YS.Eu7Mu', 'maralesuarez56@gmail.com', 'Martín Alejandro', 'Suarez', 'Masculino', 2, '2025-11-28 18:54:55', '2025-11-28 16:36:34', NULL);

-- Obras Sociales
INSERT INTO `obrasocial` (`id`, `nombre`, `siglas`, `rna`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Obra Social de Empleados Publicos', 'OSDE', 'RNA-0001', '2025-11-27 15:57:42', '2025-11-28 18:43:38', NULL),
	(2, 'Swiss Medical Group', 'SWISS', 'RNA-0002', '2025-11-27 15:57:42', '2025-11-28 15:49:15', NULL),
	(3, 'Galeno Argentina', 'GALENO', 'RNA-0003', '2025-11-27 15:57:42', '2025-11-28 15:49:19', NULL),
	(4, 'Obra Social de Empleados de Comercio', 'OSECAC', 'RNA-0004', '2025-11-27 15:57:42', '2025-11-27 15:57:42', NULL),
	(5, 'Instituto de Obra Médico Asistencial', 'IOMA', 'RNA-0005', '2025-11-27 15:57:42', '2025-11-27 15:57:42', NULL);

-- Pacientes
INSERT INTO `paciente` (`id`, `nombre`, `apellido`, `telefono`, `email`, `tipoDocumento`, `sexo_biologico`, `documento`, `numeroAfiliado`, `ObraSocial_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(6, 'Martín', 'Roldán', '1156982431', 'martin.roldan84@gmail.com', 'DNI', 'Masculino', '28459377', '1123459082', 1, '2025-11-28 19:31:12', '2025-11-28 19:31:12', NULL),
	(7, 'Gabriela', 'Sarmiento', '1173469981', 'g.sarmiento92@yahoo.com', 'LE', 'Femenino', '12844219', '2245917704', 3, '2025-11-28 19:33:25', '2025-11-28 19:33:25', NULL),
	(8, 'Nicolás', 'Ferreyra', '1140275589', 'nico.ferreyra78@hotmail.com', 'DNI', 'Masculino', '22957634', '3311786240', 4, '2025-11-28 19:34:48', '2025-11-28 19:34:48', NULL),
	(9, 'Georges Ammiel', 'David', '1150372163', 'georgessdavid@gmail.com', 'DNI', 'Masculino', '41223249', '98498654133', 1, '2025-11-28 19:41:29', '2025-11-28 19:41:29', NULL);

-- Horarios del médico
INSERT INTO `horarioatencion` (`id`, `dia`, `horaInicio`, `horaFin`, `intervalo`, `Profesional_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Lunes', '08:00:00', '12:00:00', 15, 1, '2025-11-28 15:56:28', '2025-11-28 15:56:28', NULL),
	(2, 'Martes', '14:00:00', '19:00:00', 15, 1, '2025-11-28 15:56:55', '2025-11-28 16:25:59', NULL);

-- Convenios médico–obra social
INSERT INTO `profesionalobrasocial` (`Profesional_id`, `ObraSocial_id`) VALUES
	(1, 3);
	(1, 4);
	(1, 5);

-- Turnos iniciales
INSERT INTO `turno` (`id`, `fecha`, `hora`, `estado`, `Paciente_id`, `Profesional_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(8, '2025-12-01', '08:30:00', 'Atendido', 6, 1, '2025-11-28 19:31:12', '2025-11-28 16:35:10', NULL),
	(9, '2025-12-09', '16:45:00', 'Atendido', 7, 1, '2025-11-28 19:33:25', '2025-11-28 16:35:18', NULL),
	(10, '2025-12-02', '14:30:00', 'Cancelado', 8, 1, '2025-11-28 19:34:48', '2025-11-28 16:35:20', NULL),
	(11, '2025-12-02', '15:00:00', 'Solicitado', 9, 1, '2025-11-28 19:41:29', '2025-11-28 20:06:12', NULL);