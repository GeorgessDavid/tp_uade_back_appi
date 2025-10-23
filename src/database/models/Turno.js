const { DataTypes } = require('sequelize');

module.exports = function Turno(sequelize) {
    const alias = 'Turno';

    const cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('Solicitado', 'Confirmado', 'En_Espera', 'Atendido', 'Cancelado'),
            defaultValue: 'Solicitado'
        },
        Paciente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        camelCase: false,
        freezeTableName: true,
        tableName: 'Turno',
        indexes: [
            {
                name: 'uq_turno_profesional_fecha_hora',
                unique: true,
                fields: ['Profesional_id', 'fecha', 'hora']
            },
            {
                name: 'ix_turno_fecha',
                fields: ['fecha']
            },
            {
                name: 'ix_turno_estado',
                fields: ['estado']
            }
        ]
    }

    const Turno = sequelize.define(alias, cols, config);

    Turno.associate = function (models) {
        Turno.belongsTo(models.Paciente, {
            as: 'paciente',
            foreignKey: 'Paciente_id'
        });

        Turno.belongsTo(models.Usuario, {
            as: 'profesional',
            foreignKey: 'Profesional_id'
        });
    }

    return Turno;
}
