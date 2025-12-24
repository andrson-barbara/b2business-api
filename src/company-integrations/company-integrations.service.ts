import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { CompanyIntegration } from './company-integration.entity';

@Injectable()
export class CompanyIntegrationsService {
  constructor(
    @InjectRepository(CompanyIntegration)
    private readonly repo: Repository<CompanyIntegration>,
  ) {}

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async create(company_id: string, name: string) {
    const integration = this.repo.create({
      company_id,
      name,
      token: this.generateToken(),
      active: true,
    });

    return this.repo.save(integration);
  }

  async listByCompany(company_id: string) {
    return this.repo.find({
      where: { company_id },
      order: { created_at: 'DESC' },
    });
  }

  findByToken(token: string) {
    return this.repo.findOne({
      where: { token, active: true },
    });
  }

  async revoke(id: string, company_id: string) {
    const item = await this.repo.findOne({ where: { id, company_id } });
    if (!item) return null;
    item.active = false;
    return this.repo.save(item);
  }
}
