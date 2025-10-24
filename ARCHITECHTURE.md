# Arquitectura del Proyecto — TP_UADE_BACK_APP

## 1. Propósito
Este proyecto implementa la **API back-end** para el trabajo práctico de la materia “Arquitectura de Aplicaciones”.
El objetivo es cubrir todos los requerimientos del enunciado, que incluyen:
- **Landing Page:** reserva de citas y presentación del médico.
- **Reserva de Citas:** formulario dinámico con obras sociales y disponibilidad semanal.
- **Login (médico/secretaria):** autenticación JWT y manejo de sesión.
- **Gestión de Citas:** listado, confirmación y cambio de estado de turnos.
- **Administración de Obras Sociales:** ABM completo.
- **Notificaciones:** envío de correos al crear o confirmar citas.
- **Seguridad y Privacidad:** contraseñas cifradas, sesiones protegidas, y JWT.

---

## 2. Stack Tecnológico
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Sequelize (MySQL)
- **Autenticación:** bcrypt + JWT
- **Sesiones:** express-session
- **Validaciones:** express-validator
- **Emails:** nodemailer (se integrará en servicios de notificación)
- **Entorno:** `.env` (variables de entorno)
- **Ejecución:** pnpm o npm scripts

---

## 3. Estructura de Carpetas
src/  
├─ api/ → Integraciones o rutas externas (futuro)  
├─ controllers/ → Reciben request/responses. Validan y llaman a servicios.  
├─ database/  
│ ├─ config/ → Conexión Sequelize y variables de entorno.  
│ ├─ models/ → Definición de entidades Sequelize.  
│ └─ sql/ → Script SQL inicial (init\_schema.sql)  
├─ error/ → Clases personalizadas de error.  
├─ routes/ → Definición de endpoints agrupados.  
├─ services/ → Lógica de negocio y acceso a base de datos.  
├─ types/ → Tipados y extensiones de sesión.  
├─ utils/ → Funciones auxiliares.  
├─ validations/ → Validaciones de inputs con express-validator.  
└─ index.ts → Punto de entrada del servidor.


---

## 4. Patrón de Diseño
El proyecto aplica un patrón **Service–Controller–Route**, dividido así:

| Capa | Responsabilidad | Archivos ejemplo |
|------|-----------------|------------------|
| **Route** | Define las rutas HTTP. No contiene lógica. | `/routes/user.routes.ts` |
| **Controller** | Procesa los datos recibidos, valida errores y responde al cliente. | `/controllers/user.controller.ts` |
| **Service** | Contiene la lógica de negocio, conexión a la DB y control de errores. | `/services/user.service.ts` |
| **Model** | Define la estructura de las tablas de la base de datos. | `/database/models/Usuario.ts` |
| **Validation** | Usa express-validator para sanitizar entradas. | `/validations/user.validation.ts` |

---

## 5. Convenciones Generales
- **Nombres:** PascalCase para modelos (`Usuario`), camelCase para funciones (`loginProcess`).
- **Errores:** usar la clase `CustomError` para manejar respuestas HTTP.
- **JWT:** generar token con duración de 24h y firmarlo con `JWT_SECRET`.
- **Cookies:** manejar cookies de sesión sin persistencia, configuradas desde el controller.
- **Relaciones Sequelize:** todas las asociaciones deben reflejar las claves foráneas del esquema SQL.
- **Timestamps:** Sequelize mapea `created_at` y `updated_at` automáticamente (no declarar manualmente).
- **Datos sensibles:** nunca exponer `password` en las respuestas.
- **Validaciones:** cada ruta pública debe tener middleware de validación (mínimo tipado y longitud).

---

## 6. Requisitos Funcionales Implementados
| Módulo | Estado | Descripción |
|--------|---------|-------------|
| Login | ✅ | Verifica usuario activo, compara contraseña y genera JWT |
| Sesiones | ✅ | Guarda datos del usuario en `req.session.auth` |
| Cookies | ✅ | Se setean cookies temporales con datos básicos |
| Obras Sociales | ⏳ | Pendiente ABM y asociación con profesionales |
| Turnos | ⏳ | Pendiente reserva, confirmación, cancelación |
| Notificaciones | ⏳ | Pendiente envío de correos por cambios de estado |

---

## 7. Buenas Prácticas
- No generar archivos de documentación automática como `IMPLEMENTACION_CONTROLLER.md`.
- Mantener un estilo uniforme de comentarios: encabezado descriptivo + JSDoc.
- Validar todos los datos de entrada antes de llamar al servicio.
- Evitar lógica de negocio dentro de los controllers.
- Mantener los tipos (`src/types`) sincronizados con los modelos Sequelize.

---

## 8. Variables de Entorno (ejemplo `.env.example`)
```py
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=consultorio_medico
JWT_SECRET=clave_super_segura
SESSION_SECRET=clave_session```

---

## 9. Objetivo de Arquitectura
El proyecto busca mantener una **separación clara de responsabilidades**, un código **tipado, modular y escalable**, cumpliendo con los principios **SOLID** básicos dentro del contexto académico.
