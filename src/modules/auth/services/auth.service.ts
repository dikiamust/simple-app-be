import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ReRendEmailVerificationLinkDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  UpdateUsernameDto,
} from '../dto';
import { TokenAuthService } from './token-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { sendEmail } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private tokenAuthService: TokenAuthService,
  ) {}

  async signup(dto: SignupDto): Promise<{ token: string }> {
    const { name, email, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'The password and confirmation password do not match.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = await this.userRepository.save({
      name,
      email,
      password: hash,
      salt,
    });

    const token = await this.tokenAuthService.signToken(user.id);
    await this.sendEmailVerificationLink(email, token);
    return { token };
  }

  async sendEmailVerificationLink(email: string, token: string) {
    const mailOptions = {
      to: email,
      from: process.env.MAIL_FROM,
      subject: 'Welcome to Simple-App',
    };

    const template = `src/modules/auth/template/email-verification.template.html`;
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
    const data = { verificationLink };
    sendEmail(template, data, mailOptions);
  }

  async reRendEmailVerificationLink(dto: ReRendEmailVerificationLinkDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, isEmailVerified: true },
    });

    if (!user) {
      throw new ForbiddenException('The email you provided is not registered.');
    }

    if (user.isEmailVerified) {
      throw new ForbiddenException('The email you provided has been verified.');
    }

    const token = await this.tokenAuthService.signToken(user.id);
    await this.sendEmailVerificationLink(dto.email, token);
  }

  async emailVerifiedByToken(token: string) {
    const decoded = await this.tokenAuthService.decodeToken(token);
    const userId = decoded?.userId;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, loginCount: true },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token.');
    }

    return await this.emailVerified(userId, user.loginCount);
  }

  async emailVerified(userId: number, loginCount: number) {
    return await this.userRepository.update(userId, {
      isEmailVerified: true,
      loginCount: loginCount + 1,
      loginAt: new Date(),
    });
  }

  async signin(dto: SigninDto): Promise<{ token: string }> {
    const { email, password, confirmPassword } = dto;
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'The password and confirmation password do not match.',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new ForbiddenException(
        'The email or password you provided is incorrect.',
      );
    }

    if (!user.password) {
      throw new ForbiddenException(
        'Since your account registration uses Google/Facebook, you need to request a password first.',
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ForbiddenException(
        'The email or password you provided is incorrect.',
      );
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Your email has not been verified. ');
    }

    const token = await this.tokenAuthService.signToken(user.id);

    await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
      loginAt: new Date(),
    });

    return { token };
  }

  async resetPassword(dto: ResetPasswordDto, userId: number) {
    const { oldPassword, newPassword, confirmNewPassword } = dto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user.password) {
      throw new ForbiddenException();
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new ForbiddenException('The password you provided is incorrect.');
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException(
        'The new password and confirmation password do not match.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);

    await this.userRepository.update(userId, {
      salt,
      password: hash,
    });
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, {
      logoutAt: new Date(),
    });
  }

  async myProfile(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
      select: { name: true, email: true },
    });
  }

  async updateUsername(userId: number, dto: UpdateUsernameDto) {
    await this.userRepository.update(userId, {
      name: dto.name,
    });
  }
}
