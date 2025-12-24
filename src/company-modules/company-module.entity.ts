import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from 'src/companies/company.entity';
import { AppModuleEntity } from 'src/modules/module.entity';

@Entity('company_modules')
@Index(['company_id', 'module_id'], { unique: true })
export class CompanyModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  company_id: string;

  @Column({ type: 'uuid' })
  module_id: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => AppModuleEntity, { onDelete: 'CASCADE' })
  module: AppModuleEntity;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
