import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { AgendaQuery, CreateAgendaDto, UpdateAgendaDto } from './dto';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private readonly agendaRepository: Repository<Agenda>,
  ) {}

  async create(dto: CreateAgendaDto) {
    try {
      return await this.agendaRepository.save(dto);
    } catch (error) {
      throw error;
    }
  }

  async getAll(query: AgendaQuery) {
    const currentPage = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
    const skip = (currentPage - 1) * limit;

    const qb = this.agendaRepository.createQueryBuilder('agenda');
    if (query?.keyword) {
      qb.andWhere('agenda.title ILIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    const sortingBy = query?.sortingBy || 'createdAt';
    const sortingType = query?.sortingType || 'DESC';
    qb.orderBy(`agenda.${sortingBy}`, sortingType);

    const [data, count] = await qb.skip(skip).take(limit).getManyAndCount();

    const totalPage = Math.ceil(count / limit);

    return {
      currentPage,
      totalPage,
      data,
    };
  }

  async detail(agendaId: number) {
    try {
      const agenda = await this.agendaRepository.findOne({
        where: { id: agendaId, deletedAt: IsNull() },
      });

      if (!agenda) throw new NotFoundException('Agenda not found.');

      return agenda;
    } catch (error) {
      throw error;
    }
  }

  async update(agendaId: number, dto: UpdateAgendaDto) {
    try {
      const agenda = await this.detail(agendaId);

      await this.agendaRepository.update(agendaId, dto);

      return agenda;
    } catch (error) {
      throw error;
    }
  }

  async delete(agendaId: number) {
    try {
      const agenda = await this.detail(agendaId);

      await this.agendaRepository.update(agendaId, { deletedAt: new Date() });

      return agenda;
    } catch (error) {
      throw error;
    }
  }
}
