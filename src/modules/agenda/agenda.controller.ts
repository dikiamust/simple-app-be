import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums';
import { ApiController } from 'src/decorators';
import { ResponseStatusCode } from 'src/decorators/response.decorator';
import { ResponseService } from 'src/response/response.service';
import { AgendaService } from './agenda.service';
import { AgendaQuery, CreateAgendaDto } from './dto';
import { agenda, getAll } from './response-example';

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
        example: agenda,
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
}
