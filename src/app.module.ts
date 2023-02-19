import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfiguration } from './db.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, expandVariables: true, validate }), AuthModule,
    // TypeOrmModule.forRootAsync({
    // useClass: DatabaseConfiguration,
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
