import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyModule } from './company-module.entity';

@Injectable()
export class CompanyModulesService {
  constructor(
    @InjectRepository(CompanyModule)
    private repo: Repository<CompanyModule>,
  ) {}

  async setEnabled(params: { company_id: string; module_id: string; enabled: boolean }) {
    const { company_id, module_id, enabled } = params;

    if (!company_id || !module_id) throw new BadRequestException('company_id e module_id são obrigatórios.');

    const existing = await this.repo.findOne({ where: { company_id, module_id } });

    if (!existing) {
      const created = this.repo.create({ company_id, module_id, enabled: !!enabled });
      return this.repo.save(created);
    }

    existing.enabled = !!enabled;
    return this.repo.save(existing);
  }

  async listEnabledByCompany(company_id: string) {
    return this.repo.find({
      where: { company_id, enabled: true },
      relations: ['module'],
      order: { created_at: 'ASC' },
    });
  }

  async listAllByCompany(company_id: string) {
    return this.repo.find({
      where: { company_id },
      relations: ['module'],
      order: { created_at: 'ASC' },
    });
  }
}
