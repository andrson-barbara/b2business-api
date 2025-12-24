import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CompaniesService } from './companies.service';
import { UsersService } from 'src/users/users.service';

@Controller('companies')
export class CompaniesController {
  constructor(
    private companies: CompaniesService,
    private users: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return {
      message: 'Rota protegida acessada com sucesso!',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER')
  @Get('master-only')
  masterOnly(@Req() req: any) {
    return {
      message: 'Somente MASTER acessa aqui.',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER')
  @Get()
  listAll() {
    return this.companies.findAll();
  }

  // Provisionamento do tenant
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER')
  @Post()
  async createCompanyWithAdmin(
    @Body()
    body: {
      company_name: string;
      document?: string;
      admin_name: string;
      admin_email: string;
      admin_password: string;
    },
  ) {
    const { company_name, document, admin_name, admin_email, admin_password } = body;

    if (!company_name || !admin_name || !admin_email || !admin_password) {
      throw new BadRequestException('Campos obrigatórios faltando.');
    }

    // 1) cria a empresa
    const company = await this.companies.create({
      name: company_name,
      document: document ?? null,
      active: true,
    });

    // 2) cria o admin da empresa
    const adminUser = await this.users.create({
      name: admin_name,
      email: admin_email,
      password: admin_password,
      company,
      role: 'ADMIN',
      is_master: false,
    });

    return {
      message: 'Empresa criada e ADMIN provisionado com sucesso.',
      company: {
        id: company.id,
        name: company.name,
        document: company.document,
        active: company.active,
      },
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    };
  }
}
