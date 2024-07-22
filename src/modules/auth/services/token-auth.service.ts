import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenAuthService {
  constructor(private jwt: JwtService) {}

  async signToken(id: number, roleId: number): Promise<string> {
    const payload = { id, roleId };
    const token = await this.jwt.signAsync(payload);
    return token;
  }
}
