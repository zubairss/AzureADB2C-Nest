import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { EnvironmentVariables } from 'src/env.validation';
import * as dotenv from 'dotenv';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client'
dotenv.config();

const clientId = process.env.AD_B2C_CLIENT_ID;
const tenantName = process.env.AD_B2C_TENANT_NAME;
const policyName = process.env.AD_B2C_POLICY_NAME;
const tenantId = process.env.AD_B2C_TENANT_ID;
const clientSecretValue = process.env.AD_B2C_CLIENT_SECRET_VALUE;
const extensionAppId = process.env.AD_B2C_EXTENSION_APP_ID;

const options = {
    identityMetadata: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${policyName}/v2.0/.well-known/openid-configuration`,
    tenantName,
    clientID: clientId,
    audience: clientId,
    policyName: policyName,
    isB2C: true,
    validateIssuer: false,
    passReqToCallback: false,
    // loggingLevel: "info",
}

@Injectable()
export class AzureADStrategy extends PassportStrategy(
    BearerStrategy,
    'azure-ad'
) {
    constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
        super(options);
    }

    async validate(data) {
        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecretValue);
        const client = Client.initWithMiddleware({
            authProvider: {
                async getAccessToken() {
                    const token = await credentials.getToken("https://graph.microsoft.com/.default");
                    return token.token;
                },
            },
        });
        const extensionId = extensionAppId.replace(/-/g, "");
        const userId = data.sub;
        const roleAtr = `extension_${extensionId}_role`;
        const roleRes = await await client.api(`/users/${userId}?$select=${roleAtr}`).get()
        const role = roleRes[roleAtr];
        return { ...data, role };
    }
}

export const AzureADGuard = AuthGuard('azure-ad');