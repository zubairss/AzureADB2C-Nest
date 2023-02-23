import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoles } from 'src/common/enums/enums';
import { AzureAuth } from './auth.decorator';
import { AuthService } from './auth.service';
import { AddRolesDto } from './dto/add-roles.dto';
import { GetUser } from './get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('')
  unAuthorized() {
    return 'UnAuthorized Call.'
  }

  @Post('admin')
  @AzureAuth(UserRoles.admin)
  auth1() {
    return 'Auth Admin'
  }

  @Post('manager')
  @AzureAuth(UserRoles.manger)
  auth2() {
    return 'Auth Manager'
  }

  @Post('user')
  @AzureAuth()
  auth3() {
    return 'Auth User'
  }

  @Post('manage-role')
  @AzureAuth()
  manageRole(@GetUser() user, @Body() addRolesDto: AddRolesDto) {
    return this.authService.addRoles(user, addRolesDto);
  }

  // @Post('role')
  // role(@Body() addRolesDto: AddRolesDto) {
  //   return this.authService.addRoles({ email: 'z' }, addRolesDto);
  // }

  @Post('db-test')
  dbTest() {
    return this.authService.DbQuery();
  }


}
