import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums';
import { UserService } from './user.service';
import { ApiController } from 'src/decorators';
import { ResponseStatusCode } from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { UserQuery } from './dto';
import { getAll } from './response-example';

@Controller({ path: 'user', version: ApiVersion.V1 })
@ApiController({ tag: 'User', version: ApiVersion.V1 })
@ResponseStatusCode()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private responseService: ResponseService,
  ) {}

  @ApiOperation({
    description: 'Get all users',
  })
  @ApiOkResponse({
    description: 'Success Response',
    content: {
      'application/json': {
        example: getAll,
      },
    },
  })
  @Get()
  async getAll(@Query() query: UserQuery) {
    try {
      const { currentPage, totalPage, data } = await this.userService.getAll(
        query,
      );

      return this.responseService.paging(
        'Get all users successfully retrieved!',
        totalPage,
        currentPage,
        data,
      );
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
