# Trabajo Práctico Obligatorio 
Este repositorio corresponde al Back-end del TPO.

---

## Para empezar
### Requisitos Previos
* [Node.js](https://nodejs.org/es/download) >= Versión 18 (Recomendado LTS)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) o [pnpm](https://pnpm.io/installation).
* [MySQL](https://dev.mysql.com/downloads/installer/)
### 1. Clonar el Repositorio
```bash
git clone https://github.com/GeorgessDavid/tp_uade_back_appi.git
cd tp_uade_back_appi
```

### 2. Instalar Dependencias
Con **pnpm** (recomendado):
```bash
pnpm install
```
o con **npm**:
```bash
npm install
```

### 3. Configurar la base de datos de manera local
Este proyecto utiliza MySQL como motor de base de datos. Para crearla, abre tu gestor de base de datos y ejecuta el siguiente script.
<details><summary> Click para visualizar el código </summary>

```sql
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
  estado ENUM('Solicitado','Confirmado','En_Espera','Atendido','Cancelado') DEFAULT 'Solicitado',
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
INSERT INTO Rol (nombre) VALUES
('Administrador'),
('Medico'),
('Secretaria');

-- Usuarios (contraseñas hasheadas con bcrypt)
INSERT INTO Usuario (usuario, contrasena, email, nombre, apellido, sexo_biologico, Rol_id) VALUES
('admin', '$2b$10$UqK7p9Z8tQxhVX9Z8tQxhOJ7p9Z8tQxhVX9Z8tQxhOJ7p9Z8tQxhO', 'admin@consultorio.com', 'Administrador', 'Principal', 'Masculino', 1),
('drgomez', '$2b$10$UqK7p9Z8tQxhVX9Z8tQxhOJ7p9Z8tQxhVX9Z8tQxhOJ7p9Z8tQxhO', 'drgomez@consultorio.com', 'Carlos', 'Gómez', 'Masculino', 2),
('secretaria1', '$2b$10$UqK7p9Z8tQxhVX9Z8tQxhOJ7p9Z8tQxhVX9Z8tQxhOJ7p9Z8tQxhO', 'secretaria@consultorio.com', 'María', 'López', 'Femenino', 3);

-- Obras Sociales
INSERT INTO ObraSocial (nombre, siglas, rna) VALUES
('Obra Social de Empleados Publicos', 'OSDE', 'RNA-0001'),
('Swiss Medical Group', 'SWISS', 'RNA-0002'),
('Galeno Argentina', 'GALENO', 'RNA-0003'),
('OSECAC', 'OSECAC', 'RNA-0004'),
('IOMA', 'IOMA', 'RNA-0005');

-- Pacientes
INSERT INTO Paciente (nombre, apellido, telefono, email, tipoDocumento, sexo_biologico, documento, numeroAfiliado, ObraSocial_id) VALUES
('Julián', 'Pérez', '1123456789', 'julianperez@mail.com', 'DNI', 'Masculino', '12345678', 'A001', 1),
('María', 'Torres', '1198765432', 'mariatorres@mail.com', 'DNI', 'Femenino', '22334455', 'B002', 2),
('Lucía', 'González', '1176543210', 'luciagonzalez@mail.com', 'DNI', 'Femenino', '33445566', 'C003', 3);

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
```

</details>

### 4. Configurar archivo .env
En la carpeta raíz del proyecto, antes de ejecutarlo localmente, debes configurar el archivo .env utilizando las variables de entorno que se proporcionan en el archivo `.env.example`. 
<details><summary>Ejemplo:</summary>

```bash
DB_PASSWORD= "contraseña_db"
DB_DATABASE= "consultorio_medico"
DB_HOST= "local_db_host"
DB_PORT= "local_db_puerto"
DB_DIALECT= "mysql"

# Configuración del servidor
PORT="3001"

# JWT Secret
JWT_SECRET="clave_para_jwt_aqui"

# Session Secret
SESSION_SECRET="clave_para_sesion_aqui"

# Configuración de Nodemailer
#⚠ Si utilizas una dirección de gmail, deberás habilitar las "contraseñas de aplicaciones" en tu cuenta de Google.
# Más información en: https://support.google.com/accounts/answer/185833?hl=es
NODEMAILER_USER="tu_mail@example.com"
NODEMAILER_PASS="tu_contraseña_de_email"

# Dominio
DOMAIN="localhost"

#Front-end URL
FRONT_END_URL="http://localhost:5173"

```

</details>

**⚠ SI NO REALIZAS ESTE PASO EL PROYECTO NO FUNCIONARÁ**

### 5. Inicializar el proyecto
```bash
pnpm dev 
```
o
```bash
npm run dev
```


<details><summary><strong> Enunciado </strong></summary>

### Landing Page
* La página principal debe presentar al médico, su especialidad, formación, servicios ofrecidos y datos de contacto.
* Debe incluir un formulario o enlace que permita reservar una cita.
* Debe incluir un diseño responsivo y profesional acorde a la temática médica.


---
### Reserva de Citas
* El formulario de reserva debe solicitar.
    * Nombre y Apellido
    * Nombre y Apellido del Paciente
    * Teléfono
    * Correo electrónico.
    * Obra Social.
* Debe incluir un calendario que muestre las citas disponibles durante las **dos próximas semanas**.
* Las fechas y horarios disponibles deben actualizarse dinámicamente según la ocupación.
* La obra social debe ser una lista de aquellas con las cuales el médico tiene convenio.

---
### Login para médico o secretaria
* La landing page debe incluir un acceso para el médico o su secretaria mediante usuario y contraseña.
* **No** se implementará registro de usuarios. Las credenciales del administrador.

---
### Gestión de Citas -- Área Administrativa
* Una vez logueados, el médico o su secretaria podrán:
    * Visualizar todas las citas solicitadas.
    * Confirmar una cita cambiando su estado de *"Solicitada"* a *"Confirmada"*.

---
### Administración de Obras Sociales
* El sistema debe permitir al usuario crear, modificar o eliminar obras sociales.
* Estas serán las qeu se muestren en la funcionalidad de concretar cita.

---
### Notificaciones
* Enviar notificación por correo electrónico al paciente cuando crea una nueva cita.
* Enviar notificación por correo electrónico al paciente cuando la cita pase de *"Solicitada"* a *"Confirmada"*.

---
### Seguridad y Privacidad
* Asegurar la protección de los datos de los pacientes y la privacidad de la información.
* Implementar buenas prácticas de seguridad, como el cifrado de contraseñas del administrador.
</details>

#### Integrantes
---

* Ramiro Carranza.
* Luciano Conde.
* Georges David.

---