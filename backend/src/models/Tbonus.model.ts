import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('T_bonus')
export class TBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'payday', type: 'date', nullable: true })
  payday: Date;

  @Column({ name: 'bonus_amount', type: 'integer', nullable: true })
  bonusAmount: number;

  @Column({ name: 'company_id', type: 'integer', nullable: true })
  companyId: number;

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
