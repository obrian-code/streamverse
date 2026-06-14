import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'streamverse',
  entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, 'migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  logging: process.env.NODE_ENV === 'development',
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(config);
