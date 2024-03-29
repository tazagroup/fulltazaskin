import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('vttech_payment', {orderBy: { CreateAt: 'DESC' } })
export class VttechpaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'bigint'})
  PRICE_DISCOUNTED: number;
  @Column({ type: 'bigint'})
  PAID: number;
  @Column({ type: 'bigint'})
  PRICE_TREAT: number;
  @Column({ type: 'bigint'})
  DEPOST_LEFT: number;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  PHONE: string;
  @Column({ type: 'bigint'})
  TOTALMANUAL: number;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Title: string;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 1 })
  Ordering: number;
  @Column({ default: 0 })
  Status: number;
  @CreateDateColumn()
  CreateAt: Date;
  @UpdateDateColumn()
  UpdateAt: Date;
  @DeleteDateColumn()
  DeleteAt: Date;
  @Column({ nullable: true })
  idCreate: string;
}