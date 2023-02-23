import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client'
import 'isomorphic-fetch';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/common/enums/enums';
import { AddRolesDto } from './dto/add-roles.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
const { v4: uuidv4 } = require('uuid');
import { ClientSecretCredential } from '@azure/identity';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(Auth)
        private readonly authRepo: Repository<Auth>) { }

    tenantId = this.configService.get('AD_B2C_TENANT_ID');
    clientId = this.configService.get('AD_B2C_CLIENT_ID');
    clientSecretValue = this.configService.get('AD_B2C_CLIENT_SECRET_VALUE');
    extensionAppId = this.configService.get('AD_B2C_EXTENSION_APP_ID');

    async addRoles(currentUser: object, addRolesDto: AddRolesDto) {
        try {
            const whitelistEmails = this.configService.get('READYON_ADMIN_EMAILS').split(',');
            const currentEmail = currentUser['emails'];
            const auth = whitelistEmails.some((email: string) => currentEmail.includes(email));
            if (!auth) throw new ForbiddenException('Forbidden Resource')

            const credentials = new ClientSecretCredential(this.tenantId, this.clientId, this.clientSecretValue);
            const client = Client.initWithMiddleware({
                authProvider: {
                    async getAccessToken() {
                        const token = await credentials.getToken("https://graph.microsoft.com/.default");
                        return token.token;
                    },
                },
            });


            // getting data of the user which we want to update from its access token
            const user = this.jwtService.decode(addRolesDto.accessToken)
            const userId = user['sub'];

            //extensionRole attribute name (standard by azure)
            const extensionId = this.extensionAppId.replace(/-/g, "");
            const roleAtr = `extension_${extensionId}_role`;
            const role = addRolesDto.role === UserRoles.noRole ? null : addRolesDto.role;

            //update user - get user attributes - get user role
            const [updateRes, userRes, roleRes] = await Promise.all([await client.api(`/users/${userId}`).update({ [roleAtr]: role }), await client.api(`/users/${userId}`).get(), await client.api(`/users/${userId}?$select=${roleAtr}`).get()]);

            return { ...userRes, role: roleRes[roleAtr] };
        } catch (err) {
            console.log(err);
            throw new BadRequestException(err.message);
        }
    }


    async DbQuery() {
        const auth = new Auth();
        auth.name = `${Math.random()}`;
        await this.authRepo.save(auth);
        return this.authRepo.find();
    }
}
