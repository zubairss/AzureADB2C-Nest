import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { EnvironmentVariables } from 'src/env.validation';
import * as dotenv from 'dotenv';
dotenv.config();

const clientID = process.env.CLIENT_ID;
const tenantID = process.env.TENANT_ID;

@Injectable()
export class AzureADStrategy extends PassportStrategy(
    BearerStrategy,
    'azure-ad'
) {
    constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
        super({
            identityMetadata: `https://login.microsoftonline.com/${tenantID}/v2.0/.well-known/openid-configuration`,
            clientID,
        });
    }

    async validate(data) {
        console.log('AZURE RES:' + data);
        return data;
    }
}

export const AzureADGuard = AuthGuard('azure-ad');