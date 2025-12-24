import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyIntegrationsService } from './company-integrations.service';
import { CompanyIntegrationsController } from './company-integrations.controller';

import { CompanyIntegration } from './company-integration.entity';
import { Company } from 'src/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyIntegration, Company])],
  controllers: [CompanyIntegrationsController],
  providers: [CompanyIntegrationsService],
  exports: [CompanyIntegrationsService],
})
export class CompanyIntegrationsModule {}
