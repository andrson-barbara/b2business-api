import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModuleEntity } from './module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(AppModuleEntity)
    private repo: Repository<AppModuleEntity>,
  ) {}

  async create(data: { code: string; name: string; description?: string }) {
    const code = (data.code || '').trim().toUpperCase();
    if (!code) throw new BadRequestException('code é obrigatório.');

    const exists = await this.repo.findOne({ where: { code } });
    if (exists) throw new BadRequestException('Já existe um módulo com esse code.');

    const entity = this.repo.create({
      code,
      name: data.name,
      description: data.description,
      active: true,
    });

    return this.repo.save(entity);
  }

  listAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findByCode(code: string) {
    return this.repo.findOne({ where: { code: code.toUpperCase() } });
  }
}
