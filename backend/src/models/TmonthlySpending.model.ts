import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MCategory } from './Mcategory.model';

@Entity('T_monthly_spending')
export class TMonthlySpending {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'payment_day', type: 'date' })
  paymentDay: Date;

  @Column({ name: 'store', length: 70 })
  store: string;

  // @Column({ name: 'category', type: 'integer' })
  // category: number;

  @ManyToOne(() => MCategory)
  @JoinColumn({ name: 'categoryId' })
  category: MCategory;

  @Column({ name: 'usage_fee', type: 'integer' })
  usageFee: number;

  @Column({ name: 'notes', length: 250, nullable: true })
  notes: string | null;

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
