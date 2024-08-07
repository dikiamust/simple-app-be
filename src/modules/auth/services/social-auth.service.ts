import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { GoogleAuthDto, FacebookAuthDto } from '../dto';
import { TokenAuthService } from './token-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserLinkedAccount } from 'src/modules/user/entities/user-linked-account.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { LinkedAccountTypeEnum } from 'src/modules/user/enums';

@Injectable()
export class SocialAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private tokenAuthService: TokenAuthService,
    @InjectRepository(UserLinkedAccount)
    private userLinkedAccountRepository: Repository<UserLinkedAccount>,
  ) {}

  async facebookAuth({ idToken }: FacebookAuthDto) {
    const facebookUser = await this.verifyFacebookToken(idToken);
    const email = facebookUser?.email;

    if (!email) {
      throw new UnauthorizedException(
        'Invalid Facebook token: email not found',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    const userLinkedAccount = await this.userLinkedAccountRepository.findOne({
      where: {
        email: email,
        linkedAccountType: LinkedAccountTypeEnum.Facebook,
        deletedAt: IsNull(),
        userId: user?.id,
      },
    });

    if (user && userLinkedAccount) {
      return this.signInWithFacebook(user);
    } else if (user && !userLinkedAccount) {
      return this.linkFacebookAccountAndSignIn(user, email);
    } else {
      return this.registerNewUserWithFacebook(facebookUser, email);
    }
  }

  private async verifyFacebookToken(idToken: string) {
    try {
      const { data: facebookUser } = await axios.get<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
      }>(`https://graph.facebook.com/v18.0/me`, {
        params: {
          access_token: idToken,
          fields: 'id,email,first_name,last_name',
        },
      });

      return facebookUser;
    } catch (error) {
      throw new UnauthorizedException('Invalid Facebook token');
    }
  }

  private async signInWithFacebook(user: User) {
    const token = await this.tokenAuthService.signToken(user.id);
    await this.loginCount(user);

    return {
      message: 'Login with Facebook successful.',
      data: {
        token,
        isLogin: true,
      },
    };
  }

  private async linkFacebookAccountAndSignIn(user: User, email: string) {
    await this.userLinkedAccountRepository.save({
      user: user,
      email: email,
      linkedAccountType: LinkedAccountTypeEnum.Facebook,
    });

    const token = await this.tokenAuthService.signToken(user.id);
    await this.loginCount(user);

    return {
      message: 'Login with Facebook successful.',
      data: {
        token,
        isLogin: true,
      },
    };
  }

  private async registerNewUserWithFacebook(facebookUser: any, email: string) {
    const name =
      `${facebookUser.first_name} ${facebookUser.last_name}` ||
      email?.split('@')[0];

    const newUser = await this.userRepository.save({
      name,
      email,
      isEmailVerified: true,
    });

    await this.userLinkedAccountRepository.save({
      user: newUser,
      email: email,
      linkedAccountType: LinkedAccountTypeEnum.Facebook,
    });

    const token = await this.tokenAuthService.signToken(newUser.id);

    return {
      message: 'Registration with Facebook successful.',
      data: {
        token,
        isLogin: false,
      },
    };
  }

  async googleAuth({ idToken }: GoogleAuthDto) {
    const googleUser = await this.verifyGoogleToken(idToken);
    const email = googleUser.getPayload().email;

    if (!email) {
      throw new UnauthorizedException('Invalid Google token: email not found');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    const userLinkedAccount = await this.userLinkedAccountRepository.findOne({
      where: {
        email: email,
        linkedAccountType: LinkedAccountTypeEnum.Google,
        deletedAt: IsNull(),
        userId: user?.id,
      },
    });

    if (user && userLinkedAccount) {
      return this.signInWithGoogle(user);
    } else if (user && !userLinkedAccount) {
      return this.linkGoogleAccountAndSignIn(user, email);
    } else {
      return this.registerNewUserWithGoogle(googleUser, email);
    }
  }

  private async verifyGoogleToken(idToken: string) {
    const googleAuth = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
    });

    const googleUser = await googleAuth.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    return googleUser;
  }

  private async signInWithGoogle(user: User) {
    const token = await this.tokenAuthService.signToken(user.id);
    await this.loginCount(user);

    return {
      message: 'Login with Google successful.',
      data: {
        token,
        isLogin: true,
      },
    };
  }

  private async linkGoogleAccountAndSignIn(user: User, email: string) {
    await this.userLinkedAccountRepository.save({
      user: user,
      email: email,
      linkedAccountType: LinkedAccountTypeEnum.Facebook,
    });

    const token = await this.tokenAuthService.signToken(user.id);
    await this.loginCount(user);

    return {
      message: 'Login with Google successful.',
      data: {
        token,
        isLogin: true,
      },
    };
  }

  private async registerNewUserWithGoogle(googleUser: any, email: string) {
    const name = googleUser.getPayload().name || email?.split('@')[0];
    const newUser = await this.userRepository.save({
      name,
      email,
      isEmailVerified: true,
    });

    await this.userLinkedAccountRepository.save({
      user: newUser,
      email: email,
      linkedAccountType: LinkedAccountTypeEnum.Google,
    });

    const token = await this.tokenAuthService.signToken(newUser.id);

    return {
      message: 'Registration with Google successful.',
      data: {
        token,
        isLogin: false,
      },
    };
  }

  private async loginCount(user: User) {
    return await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
    });
  }
}
