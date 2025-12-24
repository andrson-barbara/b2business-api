import { Column, Index, ManyToOne } from 'typeorm';
import { Company } from 'src/companies/company.entity';

export abstract class BaseTenantEntity {
  @Index()
  @Column({ type: 'uuid' })
  company_id: string;

  @ManyToOne(() => Company, { onDelete: 'RESTRICT' })
  company: Company;
}
