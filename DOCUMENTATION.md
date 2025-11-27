# Documentación de API - Sistema de Gestión de Turnos

## Índice
- [Endpoints Públicos](#endpoints-públicos)
- [Endpoints Privados](#endpoints-privados-requieren-autenticación)
- [Sugerencias de Seguridad](#sugerencias-de-seguridad)

---

## Endpoints Públicos

### Health Check
#### `GET /status`
Verifica el estado del servidor.

**Respuesta:**
```json
{
  "status": "OK"
}
```

---

### Autenticación

#### `POST /api/login`
Inicia sesión en el sistema.

**Body:**
```json
{
  "usuario": "string",
  "contrasena": "string"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "number",
    "nombre": "string",
    "apellido": "string",
    "Rol_id": "number"
  },
  "token": "string"
}
```

**Cookies establecidas:**
- `username`
- `id`
- `token`
- `usuario`
- `nombre`
- `apellido`

---

### Obras Sociales

#### `GET /api/obras-sociales`
Obtiene todas las obras sociales con paginación.

**Query Parameters:**
- `page` (opcional): Número de página
- `limit` (opcional): Cantidad de resultados por página

**Respuesta exitosa (200):**
```json
{
  "message": "Obras sociales obtenidas exitosamente",
  "obrasSociales": [
    {
      "id": "number",
      "nombre": "string",
      "descripcion": "string"
    }
  ]
}
```

#### `GET /api/obras-sociales/:id`
Obtiene una obra social específica por ID.

**Parámetros de ruta:**
- `id`: ID de la obra social

**Respuesta exitosa (200):**
```json
{
  "message": "Obra social obtenida exitosamente",
  "obraSocial": {
    "id": "number",
    "nombre": "string",
    "descripcion": "string"
  }
}
```

---

### Horarios de Atención

#### `GET /api/horarios-atencion`
Obtiene todos los horarios de atención disponibles.

**Respuesta exitosa (200):**
```json
{
  "message": "Horarios obtenidos exitosamente",
  "horarios": [
    {
      "id": "number",
      "Profesional_id": "number",
      "dia_semana": "number",
      "hora_inicio": "string",
      "hora_fin": "string",
      "duracion_turno_minutos": "number"
    }
  ]
}
```

#### `GET /api/horarios-atencion/:id`
Obtiene un horario de atención específico por ID.

**Parámetros de ruta:**
- `id`: ID del horario de atención

**Respuesta exitosa (200):**
```json
{
  "message": "Horario obtenido exitosamente",
  "horario": {
    "id": "number",
    "Profesional_id": "number",
    "dia_semana": "number",
    "hora_inicio": "string",
    "hora_fin": "string",
    "duracion_turno_minutos": "number"
  }
}
```

#### `GET /api/horarios-atencion/:id/slots-disponibles`
Calcula los slots de tiempo disponibles para un horario de atención en un rango de fechas.

**Parámetros de ruta:**
- `id`: ID del horario de atención

**Query Parameters:**
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)

**Respuesta exitosa (200):**
```json
{
  "message": "Slots disponibles calculados exitosamente",
  "slots": [
    {
      "fecha": "string",
      "hora": "string",
      "disponible": "boolean"
    }
  ]
}
```

---

### Turnos

#### `POST /api/turnos`
Crea un nuevo turno. Busca o crea el paciente automáticamente usando el documento.

**Body:**
```json
{
  "fecha": "string (YYYY-MM-DD)",
  "hora_inicio": "string (HH:MM)",
  "hora_fin": "string (HH:MM)",
  "Profesional_id": "number",
  "paciente": {
    "tipo_documento": "string",
    "numero_documento": "string",
    "nombre": "string",
    "apellido": "string",
    "fecha_nacimiento": "string (YYYY-MM-DD)",
    "email": "string",
    "telefono": "string",
    "obra_social_id": "number (opcional)"
  },
  "motivo": "string (opcional)",
  "notas": "string (opcional)"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Turno creado exitosamente",
  "data": {
    "id": "number",
    "fecha": "string",
    "hora_inicio": "string",
    "hora_fin": "string",
    "estado": "string",
    "Profesional_id": "number",
    "Paciente_id": "number",
    "motivo": "string",
    "notas": "string"
  }
}
```

---

## Endpoints Privados (Requieren Autenticación)

> **Nota:** Todos estos endpoints requieren estar autenticado. Se debe incluir las cookies de sesión o el token en las peticiones.

---

### Usuarios

#### `GET /api/users`
Obtiene todos los usuarios del sistema.

**Query Parameters (opcionales):**
- Filtros según validación

**Respuesta exitosa (200):**
```json
{
  "message": "Usuarios obtenidos exitosamente",
  "users": [
    {
      "id": "number",
      "usuario": "string",
      "nombre": "string",
      "apellido": "string",
      "Rol_id": "number"
    }
  ]
}
```

#### `POST /api/users`
Crea un nuevo usuario en el sistema.

**Body:**
```json
{
  "usuario": "string",
  "contrasena": "string",
  "nombre": "string",
  "apellido": "string",
  "Rol_id": "number"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "number",
    "usuario": "string",
    "nombre": "string",
    "apellido": "string",
    "Rol_id": "number"
  }
}
```

---

### Pacientes

#### `GET /api/pacientes`
Obtiene todos los pacientes registrados.

**Respuesta exitosa (200):**
```json
{
  "message": "Pacientes obtenidos exitosamente",
  "pacientes": [
    {
      "id": "number",
      "tipo_documento": "string",
      "numero_documento": "string",
      "nombre": "string",
      "apellido": "string",
      "fecha_nacimiento": "string",
      "email": "string",
      "telefono": "string",
      "obra_social_id": "number"
    }
  ]
}
```

#### `GET /api/pacientes/:id`
Obtiene un paciente específico por ID.

**Parámetros de ruta:**
- `id`: ID del paciente

**Respuesta exitosa (200):**
```json
{
  "message": "Paciente obtenido exitosamente",
  "paciente": {
    "id": "number",
    "tipo_documento": "string",
    "numero_documento": "string",
    "nombre": "string",
    "apellido": "string",
    "fecha_nacimiento": "string",
    "email": "string",
    "telefono": "string",
    "obra_social_id": "number"
  }
}
```

#### `POST /api/pacientes`
Crea un nuevo paciente.

**Body:**
```json
{
  "tipo_documento": "string",
  "numero_documento": "string",
  "nombre": "string",
  "apellido": "string",
  "fecha_nacimiento": "string (YYYY-MM-DD)",
  "email": "string",
  "telefono": "string",
  "obra_social_id": "number (opcional)"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Paciente creado exitosamente",
  "paciente": {
    "id": "number",
    "tipo_documento": "string",
    "numero_documento": "string",
    "nombre": "string",
    "apellido": "string",
    "fecha_nacimiento": "string",
    "email": "string",
    "telefono": "string",
    "obra_social_id": "number"
  }
}
```

#### `PUT /api/pacientes/:id`
Actualiza un paciente existente.

**Parámetros de ruta:**
- `id`: ID del paciente

**Body (todos los campos opcionales):**
```json
{
  "tipo_documento": "string",
  "numero_documento": "string",
  "nombre": "string",
  "apellido": "string",
  "fecha_nacimiento": "string (YYYY-MM-DD)",
  "email": "string",
  "telefono": "string",
  "obra_social_id": "number"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Paciente actualizado exitosamente",
  "paciente": {
    "id": "number",
    "tipo_documento": "string",
    "numero_documento": "string",
    "nombre": "string",
    "apellido": "string",
    "fecha_nacimiento": "string",
    "email": "string",
    "telefono": "string",
    "obra_social_id": "number"
  }
}
```

#### `DELETE /api/pacientes/:id`
Elimina un paciente (soft delete).

**Parámetros de ruta:**
- `id`: ID del paciente

**Respuesta exitosa (200):**
```json
{
  "message": "Paciente eliminado exitosamente"
}
```

---

### Turnos (Gestión Administrativa)

#### `GET /api/turnos`
Obtiene todos los turnos con filtros opcionales.

**Query Parameters (opcionales):**
- `offset`: Desplazamiento para paginación (default: 0)
- `limit`: Cantidad de resultados (default: 10)
- `fecha`: Filtrar por fecha (YYYY-MM-DD)
- `Profesional_id`: Filtrar por ID de profesional
- `Paciente_id`: Filtrar por ID de paciente
- `estado`: Filtrar por estado (Pendiente, Confirmado, Completado, Cancelado)

**Respuesta exitosa (200):**
```json
{
  "message": "Turnos obtenidos exitosamente",
  "data": {
    "turnos": [
      {
        "id": "number",
        "fecha": "string",
        "hora_inicio": "string",
        "hora_fin": "string",
        "estado": "string",
        "Profesional_id": "number",
        "Paciente_id": "number",
        "motivo": "string",
        "notas": "string",
        "Paciente": {},
        "Profesional": {}
      }
    ],
    "total": "number",
    "offset": "number",
    "limit": "number"
  }
}
```

#### `GET /api/turnos/:id`
Obtiene un turno específico por ID con toda su información relacionada.

**Parámetros de ruta:**
- `id`: ID del turno

**Respuesta exitosa (200):**
```json
{
  "message": "Turno obtenido exitosamente",
  "data": {
    "id": "number",
    "fecha": "string",
    "hora_inicio": "string",
    "hora_fin": "string",
    "estado": "string",
    "Profesional_id": "number",
    "Paciente_id": "number",
    "motivo": "string",
    "notas": "string",
    "Paciente": {},
    "Profesional": {}
  }
}
```

#### `PUT /api/turnos/:id`
Actualiza un turno existente (fecha, hora o estado).

**Parámetros de ruta:**
- `id`: ID del turno

**Body (campos opcionales):**
```json
{
  "fecha": "string (YYYY-MM-DD)",
  "hora_inicio": "string (HH:MM)",
  "hora_fin": "string (HH:MM)",
  "estado": "string (Pendiente|Confirmado|Completado|Cancelado)",
  "motivo": "string",
  "notas": "string"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Turno actualizado exitosamente",
  "data": {
    "id": "number",
    "fecha": "string",
    "hora_inicio": "string",
    "hora_fin": "string",
    "estado": "string"
  }
}
```

#### `DELETE /api/turnos/:id`
Elimina un turno (soft delete).

**Parámetros de ruta:**
- `id`: ID del turno

**Respuesta exitosa (200):**
```json
{
  "message": "Turno eliminado exitosamente"
}
```

#### `POST /api/turnos/:id/cancelar`
Cancela un turno (cambia estado a Cancelado).

**Parámetros de ruta:**
- `id`: ID del turno

**Body (opcional):**
```json
{
  "motivo_cancelacion": "string"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Turno cancelado exitosamente",
  "data": {
    "id": "number",
    "estado": "Cancelado"
  }
}
```

---

### Obras Sociales (Gestión Administrativa)

#### `POST /api/obras-sociales`
Crea una nueva obra social.

**Body:**
```json
{
  "nombre": "string",
  "descripcion": "string (opcional)"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Obra social creada exitosamente",
  "obraSocial": {
    "id": "number",
    "nombre": "string",
    "descripcion": "string"
  }
}
```

#### `PUT /api/obras-sociales/:id`
Actualiza una obra social existente.

**Parámetros de ruta:**
- `id`: ID de la obra social

**Body (campos opcionales):**
```json
{
  "nombre": "string",
  "descripcion": "string"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Obra social actualizada exitosamente",
  "obraSocial": {
    "id": "number",
    "nombre": "string",
    "descripcion": "string"
  }
}
```

#### `DELETE /api/obras-sociales/:id`
Elimina una obra social.

**Parámetros de ruta:**
- `id`: ID de la obra social

**Respuesta exitosa (200):**
```json
{
  "message": "Obra social eliminada exitosamente"
}
```

---

### Horarios de Atención (Gestión Administrativa)

#### `POST /api/horarios-atencion`
Crea un nuevo horario de atención.

**Body:**
```json
{
  "Profesional_id": "number",
  "dia_semana": "number (0-6, donde 0=Domingo)",
  "hora_inicio": "string (HH:MM)",
  "hora_fin": "string (HH:MM)",
  "duracion_turno_minutos": "number"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Horario de atención creado exitosamente",
  "horario": {
    "id": "number",
    "Profesional_id": "number",
    "dia_semana": "number",
    "hora_inicio": "string",
    "hora_fin": "string",
    "duracion_turno_minutos": "number"
  }
}
```

#### `PUT /api/horarios-atencion/:id`
Actualiza un horario de atención existente.

**Parámetros de ruta:**
- `id`: ID del horario de atención

**Body (campos opcionales):**
```json
{
  "dia_semana": "number",
  "hora_inicio": "string (HH:MM)",
  "hora_fin": "string (HH:MM)",
  "duracion_turno_minutos": "number"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Horario de atención actualizado exitosamente",
  "horario": {
    "id": "number",
    "Profesional_id": "number",
    "dia_semana": "number",
    "hora_inicio": "string",
    "hora_fin": "string",
    "duracion_turno_minutos": "number"
  }
}
```

#### `DELETE /api/horarios-atencion/:id`
Elimina un horario de atención.

**Parámetros de ruta:**
- `id`: ID del horario de atención

**Respuesta exitosa (200):**
```json
{
  "message": "Horario de atención eliminado exitosamente"
}
```

---

## Notas sobre la Arquitectura de la API

### Contexto del Proyecto
Este es un proyecto académico enfocado en la implementación de operaciones CRUD (Create, Read, Update, Delete) para un sistema de gestión de turnos médicos.

### Decisiones de Diseño

**Endpoints Públicos:**
- Los endpoints públicos permiten a los pacientes acceder a información básica y crear turnos sin necesidad de autenticación.
- La creación de turnos incluye lógica para buscar o crear pacientes automáticamente usando el documento como identificador único.

**Endpoints Privados:**
- Requieren autenticación mediante sesión (cookies).
- Permiten la gestión administrativa completa del sistema.
- Incluyen operaciones CRUD sobre todas las entidades del sistema.

**Sistema de Autenticación:**
- Basado en sesiones con Express Session.
- Las cookies se establecen después del login exitoso.
- El middleware `isLogged` protege los endpoints administrativos.

### Funcionalidades Principales

1. **Gestión de Turnos:**
   - Creación pública para pacientes.
   - Gestión completa (lectura, actualización, cancelación) para personal administrativo.

2. **Gestión de Pacientes:**
   - CRUD completo restringido al personal autorizado.
   - Creación automática al sacar turno si no existe.

3. **Configuración del Sistema:**
   - Horarios de atención configurable por profesional.
   - Catálogo de obras sociales.
   - Gestión de usuarios del sistema.

4. **Consultas Públicas:**
   - Disponibilidad de horarios.
   - Listado de obras sociales.
   - Cálculo de slots disponibles.

---

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error en la validación de datos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Autenticación

La autenticación se realiza mediante sesiones y cookies. Después de un login exitoso:

1. Se establece `req.session.auth` con los datos del usuario
2. Se establecen cookies con información del usuario
3. El middleware `isLogged` verifica la sesión en cada request a endpoints privados

**Cookies de sesión:**
- `username`
- `id`
- `token`
- `usuario`
- `nombre`
- `apellido`

Estas cookies deben incluirse en las peticiones a endpoints privados.

---

*Última actualización: 27 de noviembre de 2025*
