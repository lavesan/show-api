import { ConnectionOptions } from 'typeorm';

const config = (): ConnectionOptions => {
    return ({
      type: 'postgres',
      host: process.env.POSTGRES_HOST_NAME,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      // logging: true,
      database: process.env.POSTGRES_DATABASE,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/migrations/**/*.{ts,js}`],
      synchronize: true,
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscriber',
      },
  });
} 

export = config;
