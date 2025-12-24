import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
  ) {}

  create(data: Partial<Company>) {
    const company = this.repo.create(data);
    return this.repo.save(company);
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findAll() {
    return this.repo.find({
      select: ['id', 'name', 'document', 'created_at'],
      order: { created_at: 'DESC' },
    });
  }
}

