import { Body, Controller, Post } from '@nestjs/common';
import {
  Response,
  ResponseStatusCode,
} from 'src/decorators/response.decorator';
import { ApiVersion } from 'src/enums';
import { ResponseService } from 'src/response/response.service';
import { GoogleAuthDto, FacebookAuthDto } from '../dto';
import { ApiOperation } from '@nestjs/swagger';
import { SocialAuthService } from '../services/social-auth.service';
import { ApiController } from 'src/decorators';

@Controller({ path: 'auth', version: ApiVersion.V1 })
@ApiController({ tag: 'Auth', version: ApiVersion.V1 })
export class SocialAuthController {
  constructor(
    private authService: SocialAuthService,
    @Response() private responseService: ResponseService,
  ) {}

  @Post('facebook')
  @ApiOperation({
    description: 'Authentication via facebook account',
  })
  @ResponseStatusCode()
  async facebookAuth(@Body() dto: FacebookAuthDto) {
    try {
      const result = await this.authService.facebookAuth(dto);
      return this.responseService.success(result?.message, result.data);
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @Post('google')
  @ApiOperation({
    description: 'Authentication via Google account',
  })
  @ResponseStatusCode()
  async googleAuth(@Body() dto: GoogleAuthDto) {
    try {
      const result = await this.authService.googleAuth(dto);
      return this.responseService.success(result?.message, result.data);
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
