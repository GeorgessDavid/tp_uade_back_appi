-- =====================================================
-- MIGRACIÓN: Agregar Soft Delete (deleted_at)
-- Fecha: 2025-11-23
-- Descripción: Implementa eliminación lógica en tablas
--              con relaciones para mantener integridad
--              referencial y permitir auditoría completa
-- =====================================================

START TRANSACTION;

-- Migrar campo 'activo' a 'deleted_at' en Usuario
-- Los usuarios inactivos (activo = FALSE) se marcan como eliminados
UPDATE Usuario 
SET deleted_at = updated_at 
WHERE activo = FALSE;

-- Eliminar columna 'activo' ya que usamos deleted_at
ALTER TABLE Usuario DROP COLUMN activo;

-- Agregar columna deleted_at a tablas con relaciones
ALTER TABLE ObraSocial 
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL
COMMENT 'Fecha de eliminación lógica (NULL = activo)';

ALTER TABLE Usuario 
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL
COMMENT 'Fecha de eliminación lógica (NULL = activo)';

ALTER TABLE Paciente 
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL
COMMENT 'Fecha de eliminación lógica (NULL = activo)';

ALTER TABLE Turno 
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL
COMMENT 'Fecha de eliminación lógica (NULL = activo)';

ALTER TABLE HorarioAtencion 
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL
COMMENT 'Fecha de eliminación lógica (NULL = activo)';

-- Crear índices para mejorar performance en consultas
-- Sequelize filtra automáticamente por deleted_at IS NULL
CREATE INDEX idx_obrasocial_deleted_at ON ObraSocial(deleted_at);
CREATE INDEX idx_usuario_deleted_at ON Usuario(deleted_at);
CREATE INDEX idx_paciente_deleted_at ON Paciente(deleted_at);
CREATE INDEX idx_turno_deleted_at ON Turno(deleted_at);
CREATE INDEX idx_horario_deleted_at ON HorarioAtencion(deleted_at);

COMMIT;

-- =====================================================
-- NOTAS DE USO:
-- =====================================================
-- 1. Sequelize con paranoid: true automáticamente:
--    - Filtra registros con deleted_at IS NULL
--    - Al hacer .destroy() actualiza deleted_at = NOW()
--    - No elimina físicamente los registros
--
-- 2. Para incluir registros eliminados:
--    Model.findAll({ paranoid: false })
--
-- 3. Para restaurar un registro:
--    registro.restore()
--
-- 4. Para eliminar permanentemente:
--    registro.destroy({ force: true })
-- =====================================================
