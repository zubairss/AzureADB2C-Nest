import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): any {
        return {
            type: process.env.TYPEORM_CONNECTION,
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT, 10) || 3306,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            // Note: We are having this configuration for db synchorization here, so we don't accidently make any mistake in env, when moving to production we can change it to take value from .env, Also using Migrations is highly recommended over synchronization
            // logging: process.env.TYPEORM_LOGGING === 'true',
            // synchronize: true, //process.env.TYPEORM_SYNCHRONIZE === 'true',
            autoLoadEntities: true,
            migrationsRun: true /* process.env.TYPEORM_MIGRATIONS */,
            entities: ['dist/*/.entity.js'],
            migrations: ['dist/migration/*/.js'],
            extra: JSON.parse(process.env.TYPEORM_DRIVER_EXTRA),
            cli: {
                migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
            },
        };
    }
}