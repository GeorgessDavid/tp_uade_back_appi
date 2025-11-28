import fs from 'fs';
import path from 'path';
import { Sequelize, Options, DataTypes } from 'sequelize';
import process from 'process';
import configFile from '../config/config.cjs';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Definimos un tipo para el archivo de configuración que extiende Options
interface Config extends Options {
    use_env_variable?: string;
}

const config: Config = configFile[env as keyof typeof configFile] as Config;
const db: { [key: string]: any; sequelize?: Sequelize; Sequelize?: typeof Sequelize } = {};

export let sequelize: Sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
    sequelize = new Sequelize(config.database as string, config.username as string, config.password as string, config);
}

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.cjs'));
    })
    .forEach((file: string) => {
        const module = require(path.join(__dirname, file));
        const model = module.default ? module.default(sequelize, DataTypes) : module(sequelize, DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName: string) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('⏳ Conectando a la base de datos...');
console.log(`📊 Entorno: ${env}`);
console.log(`🗄️  Base de datos: ${config.database || 'N/A'}`);
console.log(`👤 Usuario: ${config.username || 'N/A'}`);
console.log(`🔌 Host: ${config.host || 'localhost'}:${config.port || '3306'}`);
console.log('🔄 Intentando autenticar...');

sequelize.authenticate()
    .then(() => {
        console.log('✓ Conexión a la base de datos establecida con éxito');
        console.log('✅ Listo para aceptar consultas');
    })
    .catch((error: Error) => {
        console.error('✗ No se pudo conectar a la base de datos:', error.message);
        console.error('❌ Conexión fallida. Verifique la configuración y que el servidor de base de datos esté en funcionamiento.');
    });

export default db;