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