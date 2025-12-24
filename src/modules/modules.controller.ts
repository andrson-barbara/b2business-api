import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ModulesService } from './modules.service';

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModulesController {
  constructor(private modules: ModulesService) {}

  @Roles('MASTER')
  @Post()
  create(@Body() body: { code: string; name: string; description?: string }) {
    return this.modules.create(body);
  }

  @Roles('MASTER')
  @Get()
  listAll() {
    return this.modules.listAll();
  }
}
