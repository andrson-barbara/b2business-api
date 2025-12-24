import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { RequestUser } from 'src/auth/request-user.type';
import { CompanyIntegrationsService } from './company-integrations.service';

@Controller('integrations')
export class CompanyIntegrationsController {
  constructor(private readonly integrations: CompanyIntegrationsService) {}

  // ADMIN/MASTER: criar integração na própria empresa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER', 'ADMIN')
  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() body: { name: string }) {
    if (!user.company_id) {
      throw new Error('Empresa não vinculada ao usuário.');
    }
    return this.integrations.create(user.company_id, body.name);
  }

  // ADMIN/MASTER: listar integrações da própria empresa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER', 'ADMIN')
  @Get()
  async listMine(@CurrentUser() user: RequestUser) {
    if (!user.company_id) {
      throw new Error('Empresa não vinculada ao usuário.');
    }
    return this.integrations.listByCompany(user.company_id);
  }

  // Endpoint público para o n8n chamar (token na URL)
  @Post('webhook/:token')
  async webhook(@Param('token') token: string) {
    const integration = await this.integrations.findByToken(token);

    if (!integration) {
      return { error: 'Invalid integration token' };
    }

    return {
      message: 'Webhook recebido com sucesso',
      company_id: integration.company_id,
      integration: integration.name,
    };
  }
}
