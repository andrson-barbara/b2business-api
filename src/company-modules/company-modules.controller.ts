import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CompanyModulesService } from './company-modules.service';

@Controller('company-modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyModulesController {
  constructor(private companyModules: CompanyModulesService) {}

  // MASTER: habilitar/desabilitar
  @Roles('MASTER')
  @Post('set')
  set(@Body() body: { company_id: string; module_id: string; enabled: boolean }) {
    return this.companyModules.setEnabled(body);
  }

  // MASTER: ver tudo da empresa (habilitado e desabilitado)
  @Roles('MASTER')
  @Get('company/:company_id')
  listCompany(@Param('company_id') company_id: string) {
    return this.companyModules.listAllByCompany(company_id);
  }
}
