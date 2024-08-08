import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQuery } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(query: UserQuery) {
    const currentPage = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
    const skip = (currentPage - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.createdAt',
        'user.loginCount',
        'user.logoutAt',
        'user.isEmailVerified',
      ]);

    if (query?.keyword) {
      qb.andWhere('user.name ILIKE :keyword', {
        keyword: `%${query.keyword}%`,
      });
    }

    const sortingBy = query?.sortingBy || 'createdAt';
    const sortingType = query?.sortingType || 'DESC';
    qb.orderBy(`user.${sortingBy}`, sortingType);

    const [data, count] = await qb.skip(skip).take(limit).getManyAndCount();

    const totalPage = Math.ceil(count / limit);

    return {
      currentPage,
      totalPage,
      data,
    };
  }

  async getUserStatistics() {
    const totalUsers = await this.userRepository.query(
      `SELECT COUNT(*) FROM users`,
    );

    const activeSessionsToday = await this.userRepository.query(
      `SELECT COUNT(*) FROM users WHERE login_at::date <= CURRENT_DATE AND (logout_at IS NULL OR logout_at::date >= CURRENT_DATE)`,
    );

    const averageActiveSessionsLast7Days = await this.userRepository.query(
      `SELECT AVG(daily_sessions) FROM (
         SELECT COUNT(*) AS daily_sessions
         FROM users
         WHERE login_at >= NOW() - INTERVAL '7 days'
         GROUP BY date_trunc('day', login_at)
      ) AS daily_session_counts`,
    );

    return {
      totalUsers: parseInt(totalUsers[0].count, 10),
      activeSessionsToday: parseInt(activeSessionsToday[0].count, 10),
      averageActiveSessionsLast7Days: parseFloat(
        averageActiveSessionsLast7Days[0].avg || '0',
      ),
    };
  }
}
