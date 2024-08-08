import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Redirect,
  UseGuards,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiController, User } from 'src/decorators';
import { ApiVersion } from 'src/enums';

import {
  Response,
  ResponseStatusCode,
} from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { AuthService } from '../services';

import {
  ReRendEmailVerificationLinkDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
  UpdateUsernameDto,
} from '../dto';
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

  @Version(VERSION_NEUTRAL)
  @Redirect('')
  @ResponseStatusCode()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const result = await this.authService.emailVerifiedByToken(token);
      if (!result) {
        throw new BadRequestException('Email verification failed.');
      }

      return { url: `${process.env.FE_URL}/dashboard?token=${token}` };
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @HttpCode(200)
  @ResponseStatusCode()
  @Post('resend/email-verification-link')
  async reRendEmailVerificationLink(
    @Body() dto: ReRendEmailVerificationLinkDto,
  ) {
    try {
      await this.authService.reRendEmailVerificationLink(dto);
      return this.responseService.success(
        'Resend Email Verification Link successful.',
      );
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

  @ResponseStatusCode()
  @Get('my-profile')
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard('jwt'))
  async myProfile(@User() user: IUserData) {
    try {
      const result = await this.authService.myProfile(user.userId);
      return this.responseService.success(
        'User profile retrieved successful.',
        result,
      );
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ResponseStatusCode()
  @Put('update-profile')
  @ApiBearerAuth('authorization')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@User() user: IUserData, @Body() dto: UpdateUsernameDto) {
    try {
      await this.authService.updateUsername(user.userId, dto);
      return this.responseService.success(
        'User profile updated successful.',
        dto,
      );
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
