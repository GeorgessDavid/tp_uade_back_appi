# Copilot Instructions — TP_UADE_BACK_APP

Copilot debe seguir estrictamente la arquitectura definida en `ARCHITECTURE.md`.

- No generar archivos de documentación o resúmenes automáticos como `IMPLEMENTACION_CONTROLLER.md`, `CAMBIOS_REALIZADOS.md`, etc.
- Todo nuevo módulo debe respetar el patrón **Route → Controller → Service → Model**.
- Mantener las validaciones con **express-validator** y los errores con la clase `CustomError`.
- Al trabajar con Sequelize, usar `timestamps: true`, `createdAt: 'created_at'`, `updatedAt: 'updated_at'` y no declarar manualmente esas columnas.
- No modificar estructuras existentes sin propósito explícito.
- Asegurar que cada endpoint y lógica cubra los requerimientos del enunciado original:
  - Login con JWT y bcrypt
  - ABM de obras sociales
  - Gestión y confirmación de turnos
  - Notificaciones por correo
  - Seguridad de datos y sesiones
- No usar generadores de documentación automáticos.
- No insertar comentarios extensos de autodescripción ni archivos externos, salvo los estrictamente necesarios para el código.
