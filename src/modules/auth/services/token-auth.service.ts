import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenAuthService {
  constructor(private jwt: JwtService) {}

  async signToken(userId: number): Promise<string> {
    const payload = { userId };
    const token = await this.jwt.signAsync(payload);
    return token;
  }
}
