import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnvironmentVariables } from 'src/env.validation';
import { AuthService } from './auth.service';
import { AzureADGuard } from './azure-ad.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService<EnvironmentVariables>) { }

  @Get('unAuth')
  unAuthorized() {
    return 'UnAuthorized Call'
  }

  @ApiBearerAuth()
  @UseGuards(AzureADGuard)
  @Post('auth1')
  auth1() {
    return 'Auth Call 1'
  }

  @ApiBearerAuth()
  @Post('auth2')
  auth2() {
    return 'Auth Call 2'
  }

  @ApiBearerAuth()
  @Post('auth3')
  auth3() {
    return 'Auth Call 3'
  }


}
