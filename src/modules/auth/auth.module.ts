import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService, TokenAuthService } from './services';
import { AuthController } from './controllers';

import { User } from '../user/entities/user.entity';
import { JwtStrategy } from 'src/guards/strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE,
        },
      }),
    }),
  ],
  providers: [AuthService, TokenAuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
