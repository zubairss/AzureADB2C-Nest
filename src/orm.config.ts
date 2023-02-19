import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import './utils/extensions';
dotenv.config();

export default new DataSource({
    type: process.env.TYPEORM_CONNECTION as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT) || 5432,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,

    entities: ['src/*/.entity{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrations: ['src/migration/*/.ts'],
    /* Note : it is unsafe to use synchronize: true for schema synchronization
      on production once you get data in your database. */
    logging: process.env.TYPEORM_LOGGING === 'true',
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    migrationsRun: process.env.TYPEORM_RUN_MIGRATIONS === 'true',
});