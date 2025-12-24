import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TenantGuard } from 'src/auth/tenant.guard';
import { TenantRequired } from 'src/auth/tenant-required.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { RequestUser } from 'src/auth/request-user.type';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
@TenantRequired()
export class CustomersController {
  constructor(private customers: CustomersService) {}

  @Roles('MASTER', 'ADMIN', 'USER')
  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.customers.list(user.company_id!);
  }

  @Roles('MASTER', 'ADMIN')
  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() body: { name: string; email?: string },
  ) {
    return this.customers.create(user.company_id!, body);
  }
}
