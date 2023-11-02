// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('M_company')
// export class MCompany {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: 'user_id', type: 'integer' })
//   userId: number;

//   @Column({ name: 'name', length: 100 })
//   name: string;

//   @Column({ name: 'major_sector', length: 70 })
//   majorSector: string;

//   @Column({ name: 'subsector', length: 50, nullable: true })
//   subsector: string;

//   @Column({ name: 'industry', length: 50, nullable: true })
//   industry: string;

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
