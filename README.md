# Trabajo Práctico Obligatorio - Backend API
Este repositorio corresponde al **Backend/API REST** del TPO de Sistema de Gestión de Turnos.

> **🔗 Arquitectura**: Este proyecto implementa el backend de un sistema con frontend separado. La comunicación se realiza mediante API REST con autenticación basada en sesiones.
> 
> **🎨 Frontend**: El frontend se encuentra en un repositorio separado: [tp_uade_front_appi](https://github.com/GeorgessDavid/tp_uade_front_appi)

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

**📝 Nota sobre Frontend**: Si tienes el frontend en otro repositorio, asegúrate de que la `FRONT_END_URL` coincida con la URL donde se ejecuta tu frontend para permitir la comunicación CORS.

### 5. Inicializar el proyecto
```bash
pnpm dev 
```
o
```bash
npm run dev
```

### 6. Verificar instalación
Si todo funciona correctamente, deberías ver un mensaje similar a:
```
🚀 Servidor ejecutándose en puerto 3001
📍 URL: http://localhost:3001
✅ Base de datos conectada exitosamente
```

---

## Troubleshooting

### Problemas Comunes

**❌ Error de conexión a la base de datos**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solución:**
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que el puerto sea el correcto

**❌ Error "Base de datos no existe"**
```
Error: Unknown database 'consultorio_medico'
```
**Solución:**
- Ejecuta el script SQL del paso 3 para crear la base de datos

**❌ Error de dependencias**
```
Module not found
```
**Solución:**
```bash
# Borra node_modules y reinstala
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**❌ Puerto ocupado**
```
Error: listen EADDRINUSE :::3001
```
**Solución:**
- Cambia el puerto en el archivo `.env`.

### Credenciales
* Usuario: `masuarez`
* Contraseña: `masuarez`

---

## Documentación de la API

### 🌐 Repositorios del Proyecto
- **📁 Backend (este repositorio)**: [tp_uade_back_appi](https://github.com/GeorgessDavid/tp_uade_back_appi)
- **📁 Frontend**: [tp_uade_front_appi](https://github.com/GeorgessDavid/tp_uade_front_appi)

### 📋 Documentación Completa
Para información detallada sobre todos los endpoints, consulta: **[`DOCUMENTATION.md`](./DOCUMENTATION.md)**

La documentación incluye:
- 🏗️ **Diagrama y estructura de la base de datos**
- 📡 **Todos los endpoints disponibles** (públicos y privados)
- 🔧 **Parámetros y respuestas de cada endpoint**
- 🔐 **Sistema de autenticación y autorización**
- 🌐 **Información sobre integración frontend**

### 🚀 Endpoints Principales

**Públicos (sin autenticación):**
- `GET /status` - Health check del servidor
- `POST /api/users/login` - Inicio de sesión
- `GET /api/obras-sociales` - Listado de obras sociales
- `GET /api/horarios-atencion` - Horarios disponibles
- `POST /api/turnos` - Crear nuevo turno (para pacientes)

**Privados (requieren autenticación):**
- `POST /api/users/logout` - Cerrar sesión
- `GET /api/users` - Gestión de usuarios
- `GET /api/pacientes` - Gestión de pacientes
- `GET /api/turnos` - Gestión de turnos (administrativa)
- Endpoints CRUD completos para todas las entidades

---

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