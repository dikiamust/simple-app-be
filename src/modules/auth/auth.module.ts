import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService, TokenAuthService } from './services';
import { AuthController, SocialAuthController } from './controllers';

import { User } from '../user/entities/user.entity';
import { JwtStrategy } from 'src/guards/strategy/jwt.strategy';
import { UserLinkedAccount } from '../user/entities/user-linked-account.entity';
import { SocialAuthService } from './services/social-auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLinkedAccount]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE,
        },
      }),
    }),
  ],
  providers: [AuthService, SocialAuthService, TokenAuthService, JwtStrategy],
  controllers: [AuthController, SocialAuthController],
})
export class AuthModule {}
