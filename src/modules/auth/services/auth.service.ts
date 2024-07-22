import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SigninDto, SignupDto } from '../dto';
import { TokenAuthService } from './token-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private tokenAuthService: TokenAuthService,
  ) {}

  async signup(dto: SignupDto): Promise<{ token: string }> {
    const { name, email, password } = dto;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = await this.userRepository.save({
      name,
      email,
      password: hash,
      salt,
      roleId: 1,
    });

    const token = await this.tokenAuthService.signToken(user.id, user.roleId);

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

    const token = await this.tokenAuthService.signToken(user.id, user.roleId);

    return { token };
  }
}
