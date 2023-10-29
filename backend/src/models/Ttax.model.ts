import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('T_tax')
export class TTax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'company_id', type: 'integer', nullable: true })
  companyId: number;

  @Column({ name: 'health_insurance_expense', nullable: true, type: 'integer' })
  healthInsuranceExpense: number;

  @Column({
    name: 'employee_pension_insurance_expense',
    nullable: true,
    type: 'integer',
  })
  employeePensionInsuranceExpense: number;

  @Column({
    name: 'national_pension_insurance_expense',
    nullable: true,
    type: 'integer',
  })
  nationalPensionInsuranceExpense: number;

  @Column({
    name: 'employee_insurance_expense',
    nullable: true,
    type: 'integer',
  })
  employeeInsuranceExpense: number;

  @Column({ name: 'long_term_care_insurance', nullable: true, type: 'integer' })
  longTermCareInsurance: number;

  @Column({ name: 'income_tax', nullable: true, type: 'integer' })
  incomeTax: number;

  @Column({ name: 'residence_tax', nullable: true, type: 'integer' })
  residenceTax: number;

  @Column({ name: 'year_end_adjustment', length: 250, nullable: true })
  yearEndAdjustment: string;

  @Column({ name: 'notes', length: 250, nullable: true })
  notes: string;

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
