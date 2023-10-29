import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('M_hire_date')
export class MHireDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'company_id', type: 'integer' })
  companyId: number;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ name: 'retirement_date', type: 'date', nullable: true })
  retirementDate: Date;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
