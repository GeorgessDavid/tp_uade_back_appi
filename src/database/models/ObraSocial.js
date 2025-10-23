const { DataTypes } = require('sequelize');

module.exports = function ObraSocial(sequelize) {
    const alias = 'ObraSocial';

    const cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true
        }
    }

    const config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        camelCase: false,
        freezeTableName: true,
        tableName: 'ObraSocial'
    }

    const ObraSocial = sequelize.define(alias, cols, config);

    ObraSocial.associate = function (models) {
        ObraSocial.hasMany(models.Paciente, {
            as: 'pacientes',
            foreignKey: 'ObraSocial_id'
        });

        ObraSocial.belongsToMany(models.Usuario, {
            as: 'profesionales',
            through: 'ProfesionalObraSocial',
            foreignKey: 'ObraSocial_id',
            otherKey: 'Profesional_id'
        });
    }

    return ObraSocial;
}
