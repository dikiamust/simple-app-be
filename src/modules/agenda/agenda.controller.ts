import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums';
import { ApiController } from 'src/decorators';
import { ResponseStatusCode } from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { AgendaService } from './agenda.service';
import { AgendaQuery, CreateAgendaDto, UpdateAgendaDto } from './dto';
import { created, deleted, getAll, updated } from './response-example';

@Controller({ path: 'agenda', version: ApiVersion.V1 })
@ApiController({ tag: 'Agenda', version: ApiVersion.V1 })
@ResponseStatusCode()
export class AgendaController {
  constructor(
    private readonly agendaService: AgendaService,
    private responseService: ResponseService,
  ) {}

  @ApiOperation({
    description: 'Create Agenda',
  })
  @ApiOkResponse({
    description: 'Success Response',
    content: {
      'application/json': {
        example: created,
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateAgendaDto) {
    try {
      await this.agendaService.create(dto);
      return this.responseService.success('Agenda created succesfully.');
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ApiOperation({
    description: 'Get all agendas',
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
  async getAll(@Query() query: AgendaQuery) {
    try {
      const { currentPage, totalPage, data } = await this.agendaService.getAll(
        query,
      );

      return this.responseService.paging(
        'Get all agendas successfully retrieved!',
        totalPage,
        currentPage,
        data,
      );
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ApiOperation({
    description: 'Update Agenda',
  })
  @ApiOkResponse({
    description: 'Success Response',
    content: {
      'application/json': {
        example: updated,
      },
    },
  })
  @Patch(':agendaId')
  async update(
    @Param('agendaId') agendaId: number,
    @Body() dto: UpdateAgendaDto,
  ) {
    try {
      await this.agendaService.update(agendaId, dto);
      return this.responseService.success('Agenda updated succesfully.');
    } catch (error) {
      return this.responseService.error(error);
    }
  }

  @ApiOperation({
    description: 'Delete Agenda',
  })
  @ApiOkResponse({
    description: 'Success Response',
    content: {
      'application/json': {
        example: deleted,
      },
    },
  })
  @Delete(':agendaId')
  async delete(@Param('agendaId') agendaId: number) {
    try {
      await this.agendaService.delete(agendaId);
      return this.responseService.success('Agenda deleted succesfully.');
    } catch (error) {
      return this.responseService.error(error);
    }
  }
}
