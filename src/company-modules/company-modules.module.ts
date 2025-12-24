import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company-module.entity';
import { CompanyModulesService } from './company-modules.service';
import { CompanyModulesController } from './company-modules.controller';
import { MyModulesController } from './my-modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyModule])],
  providers: [CompanyModulesService],
  controllers: [CompanyModulesController, MyModulesController],
  exports: [CompanyModulesService],
})
export class CompanyModulesModule {}
