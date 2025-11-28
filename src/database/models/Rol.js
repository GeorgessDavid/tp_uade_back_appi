const { DataTypes } = require('sequelize');

module.exports = function Rol(sequelize) {
    const alias = 'Rol';

    const cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(50),
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
        tableName: 'Rol'
    }

    const Rol = sequelize.define(alias, cols, config);

    Rol.associate = function (models) {
        Rol.hasMany(models.Usuario, {
            as: 'usuarios',
            foreignKey: 'Rol_id'
        });
    }

    return Rol;
}