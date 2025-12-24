import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(data: { name: string; email: string; password: string; 
company?: any; role?: string; is_master?: boolean }) {
    const password_hash = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role || 'USER',
      is_master: data.is_master ?? false,
      company: data.company,
    });

    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['company'] });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['company'] });
  }
}

