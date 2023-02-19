import { plainToClass } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    validateSync,
} from 'class-validator';

enum AppEnvironment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Staging = 'staging',
}

enum Database {
    mariaDb = 'mariaDb',
}

export class EnvironmentVariables {
    @IsNumber()
    PORT: number;

    @IsEnum(AppEnvironment)
    NODE_ENV: AppEnvironment;

    @IsString()
    CLIENT_ID: string;

    @IsString()
    TENANT_ID: string;

    @IsString()
    TYPEORM_CONNECTION: string;

    @IsString()
    TYPEORM_HOST: string;

    @IsString()
    TYPEORM_USERNAME: string;

    @IsString()
    TYPEORM_PASSWORD: string;

    @IsString()
    TYPEORM_DATABASE: string;

    @IsNumber()
    TYPEORM_PORT: number;

    @IsBoolean()
    TYPEORM_RUN_MIGRATIONS: boolean;

    @IsBoolean()
    TYPEORM_LOGGING: boolean;

    @IsBoolean()
    TYPEORM_SYNCHRONIZE: boolean;

    @IsString()
    TYPEORM_ENTITIES: string;

    @IsString()
    TYPEORM_MIGRATIONS: string;

    @IsString()
    TYPEORM_MIGRATIONS_DIR: string;

    @IsString()
    TYPEORM_DRIVER_EXTRA: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}