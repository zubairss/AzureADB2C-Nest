import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AzureADStrategy } from './azure-ad.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

@Module({
  imports: [PassportModule, JwtModule, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService, AzureADStrategy]
})
export class AuthModule { }
