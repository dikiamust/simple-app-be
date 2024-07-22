import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums';
import { ApiController } from 'src/decorators';
import { ResponseStatusCode } from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { RoleService } from './role.service';
import { CreateRoleDto, RoleQuery } from './dto';
import { getAll, role } from './response-example';

@Controller({ path: 'role', version: ApiVersion.V1 })
@ApiController({ tag: 'Role', version: ApiVersion.V1 })
@ResponseStatusCode()
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private responseService: ResponseService,
  ) {}

  @ApiOperation({
    description: 'Create Role',
  })
  @ApiOkResponse({
    description: 'Success Response',
    content: {
      'application/json': {
        example: role,
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    try {
      await this.roleService.create(dto);
      return this.responseService.success('Role created succesfully.');
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ApiOperation({
    description: 'Get all roles',
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
  async getAll(@Query() query: RoleQuery) {
    try {
      const { currentPage, totalPage, data } = await this.roleService.getAll(
        query,
      );

      return this.responseService.paging(
        'Get all roles successfully retrieved!',
        totalPage,
        currentPage,
        data,
      );
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
