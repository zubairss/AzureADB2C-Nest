import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('unAuth')
  unAuthorized() {
    return 'UnAuthorized Call'
  }

  @ApiBearerAuth()
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
