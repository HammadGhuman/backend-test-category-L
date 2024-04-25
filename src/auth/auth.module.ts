import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import {  AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[UsersModule,PassportModule,JwtModule.register({
    secret:'secret123',
    signOptions:{expiresIn:'3600s'}
  })],
  providers: [AuthService,LocalStrategy,JwtStrategy,AuthResolver],
  exports:[AuthService]
})
export class AuthModule {}
