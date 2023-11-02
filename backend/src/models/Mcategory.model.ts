// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('M_category')
// export class MCategory {
//   @PrimaryGeneratedColumn({ name: 'category_id' })
//   categoryId: number;

//   @Column({ name: 'user_id', type: 'integer' })
//   userId: number;

//   @Column({ name: 'category_name', length: 50 })
//   categoryName: string;

//   @CreateDateColumn({
//     name: 'createdAt',
//     type: 'timestamptz',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   createdAt: Date;

//   @UpdateDateColumn({
//     name: 'updatedAt',
//     type: 'timestamptz',
//     default: () => 'CURRENT_TIMESTAMP',
//   })
//   updatedAt: Date;
// }
