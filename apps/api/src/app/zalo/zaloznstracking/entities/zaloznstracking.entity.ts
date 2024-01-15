import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('zaloznstracking', {orderBy: { CreateAt: 'DESC' } })
export class ZaloznstrackingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  SDT: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Hoten: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  msg_id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  template_id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  tracking_id: string;
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