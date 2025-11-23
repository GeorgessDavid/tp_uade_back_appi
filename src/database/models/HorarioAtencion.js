const { DataTypes } = require('sequelize');

module.exports = function HorarioAtencion(sequelize) {
    const alias = 'HorarioAtencion';

    const cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        dia: {
            type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'),
            allowNull: false
        },
        horaInicio: {
            type: DataTypes.TIME,
            allowNull: false
        },
        horaFin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        intervalo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Intervalo en minutos'
        },
        Profesional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }

    const config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true, // Soft delete: mantiene integridad referencial evitando eliminación física
        deletedAt: 'deleted_at',
        camelCase: false,
        freezeTableName: true,
        tableName: 'HorarioAtencion',
        indexes: [
            {
                name: 'ix_horario_dia',
                fields: ['dia']
            }
        ]
    }

    const HorarioAtencion = sequelize.define(alias, cols, config);

    HorarioAtencion.associate = function (models) {
        HorarioAtencion.belongsTo(models.Usuario, {
            as: 'profesional',
            foreignKey: 'Profesional_id'
        });
    }

    return HorarioAtencion;
}
