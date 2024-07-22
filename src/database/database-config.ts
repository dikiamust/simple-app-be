import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const databaseConfig: DataSourceOptions = {
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV == 'development' ? true : false, // never use TRUE in production!
  logging: process.env.NODE_ENV == 'development' ? true : false,
  migrationsRun: false,
};

export default databaseConfig;
