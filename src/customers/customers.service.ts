import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private repo: Repository<Customer>,
  ) {}

  create(company_id: string, data: { name: string; email?: string }) {
    const customer = this.repo.create({
      company_id,
      name: data.name,
      email: data.email,
    });
    return this.repo.save(customer);
  }

  list(company_id: string) {
    return this.repo.find({ where: { company_id }, order: { created_at: 'DESC' } });
  }

  findById(company_id: string, id: string) {
    return this.repo.findOne({ where: { id, company_id } });
  }
}
