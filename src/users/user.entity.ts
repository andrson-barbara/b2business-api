import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, 
CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from 'src/companies/company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, { nullable: true })
  company: Company; // null = usuário master

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: 'USER' })
  role: string; // USER | ADMIN | OWNER | MASTER

  @Column({ default: false })
  is_master: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

