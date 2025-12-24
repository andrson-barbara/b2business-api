import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';

import { ModulesModule } from './modules/modules.module';
import { CompanyModulesModule } from './company-modules/company-modules.module';
import { CompanyIntegrationsModule } from './company-integrations/company-integrations.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // DEV somente
      }),
    }),

    CompaniesModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    ModulesModule,
    CompanyModulesModule,
    CompanyIntegrationsModule,
  ],
})
export class AppModule {}

