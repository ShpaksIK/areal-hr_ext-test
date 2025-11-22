import { Global, Module } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';
import { config } from 'dotenv';

config();

const databaseConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
};

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: () => new Pool(databaseConfig),
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
