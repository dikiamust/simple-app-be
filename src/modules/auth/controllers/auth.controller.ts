import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiController, User } from 'src/decorators';
import { ApiVersion } from 'src/enums';

import {
  Response,
  ResponseStatusCode,
} from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { AuthService } from '../services';

import { ResetPasswordDto, SigninDto, SignupDto } from '../dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IUserData } from 'src/guards/strategy/interface/user-data.interface';

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

      return this.responseService.success('Registration successful.', result);
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

      return this.responseService.success('Login successful.', result);
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ResponseStatusCode()
  @Put('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(dto, 1);

      return this.responseService.success('Password reset successful.');
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ResponseStatusCode()
  @Put('logout')
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard('jwt'))
  async logout(@User() user: IUserData) {
    try {
      await this.authService.logout(user.userId);
      return this.responseService.success('Logout successful.');
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
