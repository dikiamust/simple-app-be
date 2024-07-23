import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiController } from 'src/decorators';
import { ApiVersion } from 'src/enums';

import {
  Response,
  ResponseStatusCode,
} from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { AuthService } from '../services';

import { SigninDto, SignupDto } from '../dto';

@Controller({ path: 'auth', version: ApiVersion.V1 })
@ApiController({ tag: 'Auth', version: ApiVersion.V1 })
export class AuthController {
  constructor(
    private authService: AuthService,
    @Response() private responseService: ResponseService,
  ) {}

  @ResponseStatusCode()
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    try {
      const result = await this.authService.signup(dto);

      return this.responseService.success('success signup', result);
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @HttpCode(200)
  @ResponseStatusCode()
  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    try {
      const result = await this.authService.signin(dto);

      return this.responseService.success('success login', result);
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
