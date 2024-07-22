import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto, RoleQuery } from './dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    try {
      return await this.roleRepository.save(dto);
    } catch (error) {
      if (error.driverError)
        throw new BadRequestException(error.driverError.detail);
      throw error;
    }
  }

  async getAll(query: RoleQuery) {
    const currentPage = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
    const skip = (currentPage - 1) * limit;

    const qb = this.roleRepository.createQueryBuilder('role');
    if (query?.keyword) {
      qb.andWhere('role.name ILIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    const sortingBy = query?.sortingBy || 'createdAt';
    const sortingType = query?.sortingType || 'DESC';
    qb.orderBy(`role.${sortingBy}`, sortingType);

    const [data, count] = await qb.skip(skip).take(limit).getManyAndCount();

    const totalPage = Math.ceil(count / limit);

    return {
      currentPage,
      totalPage,
      data,
    };
  }
}
