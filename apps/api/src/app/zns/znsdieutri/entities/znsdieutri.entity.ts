import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity('znsdieutri', {orderBy: { CreateAt: 'DESC' } })
export class ZnsdieutriEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustPhone: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustName: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustCode: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  BranchID: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Code: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  msg_id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  messageId: string;
  @Column({ type: 'bigint'})
  Paid: number;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 1 })
  Ordering: number;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Dulieu: string;
  @Column({default: 0})
  Status: number;
  @Column()
  Statuscode: number;
  @Column()
  SMSCode: number;
  @Column()
  Created: Date;
  @CreateDateColumn()
  CreateAt: Date;
  @UpdateDateColumn()
  UpdateAt: Date;
  @DeleteDateColumn()
  DeleteAt: Date;
  @Column({ nullable: true })
  idCreate: string;
}