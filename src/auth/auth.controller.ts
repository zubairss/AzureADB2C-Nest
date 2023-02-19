import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnvironmentVariables } from 'src/env.validation';
import { AzureAuth } from './auth.decorator';
import { AuthService } from './auth.service';
import { AzureADGuard } from './azure-ad.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('')
  unAuthorized() {
    return 'UnAuthorized Call.'
  }

  @Post('authA')
  @AzureAuth()
  auth1() {
    return 'Auth Call 1'
  }

  @Post('authB')
  @AzureAuth()
  auth2() {
    return 'Auth Call 2'
  }

  @Post('authC')
  @AzureAuth()
  auth3() {
    return 'Auth Call 3'
  }


}
