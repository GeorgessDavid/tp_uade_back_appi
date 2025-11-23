const { DataTypes } = require('sequelize');

module.exports = function Paciente(sequelize) {
    const alias = 'Paciente';

    const cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        tipoDocumento: {
            type: DataTypes.ENUM('LE', 'LC', 'DNI'),
            defaultValue: 'DNI'
        },
        sexo_biologico: {
            type: DataTypes.ENUM('Masculino', 'Femenino'),
            allowNull: false
        },
        documento: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        numeroAfiliado: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        ObraSocial_id: {
            type: DataTypes.INTEGER,
            allowNull: true
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
        tableName: 'Paciente',
        indexes: [
            {
                name: 'ix_paciente_nombre',
                fields: ['apellido', 'nombre']
            }
        ]
    }

    const Paciente = sequelize.define(alias, cols, config);

    Paciente.associate = function (models) {
        Paciente.belongsTo(models.ObraSocial, {
            as: 'obraSocial',
            foreignKey: 'ObraSocial_id'
        });

        Paciente.hasMany(models.Turno, {
            as: 'turnos',
            foreignKey: 'Paciente_id'
        });
    }

    return Paciente;
}
