import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto, SigninDto, SignupDto } from '../dto';
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

    const mailOptions = {
      to: email,
      from: process.env.MAIL_FROM,
      subject: 'Welcome to Simple-App',
    };

    const template = `src/modules/auth/template/email-verification.template.html`;
    const data = { link: 'https://google.com' };
    sendEmail(template, data, mailOptions);

    return { token };
  }

  async signin(dto: SigninDto): Promise<{ token: string }> {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new ForbiddenException(
        'The email or password you provided is incorrect. Please double-check your login credentials and try again.',
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ForbiddenException(
        'The email or password you provided is incorrect. Please double-check your login credentials and try again.',
      );
    }

    const token = await this.tokenAuthService.signToken(user.id);

    await this.userRepository.update(user.id, {
      loginCount: user.loginCount + 1,
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
}
