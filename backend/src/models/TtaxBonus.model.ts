import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('T_tax_bonus')
export class TTaxBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'company_id', type: 'integer', nullable: true })
  companyId: number;

  @Column({ name: 'health_insurance_expense', nullable: true })
  healthInsuranceExpense: number;

  @Column({ name: 'employee_pension_insurance_expense', nullable: true })
  employeePensionInsuranceExpense: number;

  @Column({ name: 'national_pension_insurance_expense', nullable: true })
  nationalPensionInsuranceExpense: number;

  @Column({ name: 'employee_insurance_expense', nullable: true })
  employeeInsuranceExpense: number;

  @Column({ name: 'long_term_care_insurance', nullable: true })
  longTermCareInsurance: number;

  @Column({ name: 'income_tax', nullable: true })
  incomeTax: number;

  @Column({ name: 'residence_tax', nullable: true })
  residenceTax: number;

  @Column({ name: 'year_end_adjustment', length: 250, nullable: true })
  yearEndAdjustment: number;

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
