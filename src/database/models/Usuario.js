const { DataTypes } = require('sequelize');

module.exports = function Usuario(sequelize) {
    const alias = 'Usuario';

    const cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        usuario: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        contrasena: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        sexo_biologico: {
            type: DataTypes.ENUM('Masculino', 'Femenino'),
            allowNull: false
        },
        Rol_id: {
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
        tableName: 'Usuario'
    }

    const Usuario = sequelize.define(alias, cols, config);

    Usuario.associate = function (models){
        Usuario.belongsTo(models.Rol, {
            as: 'rol',
            foreignKey: 'Rol_id'
        });

        Usuario.hasMany(models.HorarioAtencion, {
            as: 'horariosAtencion',
            foreignKey: 'Profesional_id'
        });

        Usuario.hasMany(models.Turno, {
            as: 'turnos',
            foreignKey: 'Profesional_id'
        });

        Usuario.belongsToMany(models.ObraSocial, {
            as: 'obrasSociales',
            through: 'ProfesionalObraSocial',
            foreignKey: 'Profesional_id',
            otherKey: 'ObraSocial_id'
        });
    }

    return Usuario;
}