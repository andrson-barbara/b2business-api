import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TenantGuard } from 'src/auth/tenant.guard';
import { TenantRequired } from 'src/auth/tenant-required.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { RequestUser } from 'src/auth/request-user.type';
import { CompanyModulesService } from './company-modules.service';

@Controller('me/modules')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@TenantRequired()
export class MyModulesController {
  constructor(private companyModules: CompanyModulesService) {}

  @Roles('ADMIN', 'USER', 'MASTER')
  @Get()
  list(@CurrentUser() user: RequestUser) {
    if (!user.company_id) {
        // Nunca deveria acontecer por causa do TenantGuard,
        // mas mantém o TypeScript e a arquitetura felizes
        throw new Error('company_id ausente no token');
    }

    return this.companyModules.listEnabledByCompany(user.company_id);
  }
}
