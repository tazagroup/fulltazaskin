import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('vttech_dieutri', {orderBy: { CreateAt: 'DESC' } })
export class Vttech_dieutriEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  SDT: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  SDT2: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustName: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustCode: string;
  @Column({type:'date'})
  NgayVttech: Date;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustID: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  idVttech: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  checkTime: string;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 1 })
  Ordering: number;
  @Column({ default: 0 })
  Status: number;
  @Column({ nullable: true })
  Created: Date;
  @Column({ nullable: true })
  SendZNSAt: Date;
  @CreateDateColumn()
  CreateAt: Date;
  @UpdateDateColumn()
  UpdateAt: Date;
  @DeleteDateColumn()
  DeleteAt: Date;
  @Column({ nullable: true })
  idCreate: string;
}


// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
// } from 'typeorm';
// @Entity('vttech_dieutri', {orderBy: { CreateAt: 'DESC' } })
// export class Vttech_dieutriEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   SDT: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   CustID: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   CustCode: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   CustName: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   ServiceName: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   BranchCode: string;
//   @Column({ type: 'text', collation: 'utf8_general_ci' })
//   BranchName: string;
//   @Column({ default: '' })
//   Slug: string;
//   @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
//   Dulieu: string;
//   @Column({ default: '' })
//   Type: string;
//   @Column({ default: 1 })
//   Ordering: number;
//   @Column({ default: 0 })
//   Status: number;
//   @Column({ nullable: true })
//   Created: Date;
//   @Column({ nullable: true })
//   TimeZNS: Date;
//   @Column({ nullable: true })
//   SendZNSAt: Date;
//   @CreateDateColumn()
//   CreateAt: Date;
//   @UpdateDateColumn()
//   UpdateAt: Date;
//   @DeleteDateColumn()
//   DeleteAt: Date;
//   @Column({ nullable: true })
//   idCreate: string;
// }