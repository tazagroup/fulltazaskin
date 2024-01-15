import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('zalodanhgia', {orderBy: { CreateAt: 'DESC' } })
export class ZalodanhgiaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  idCN: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Chinhanh: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  msgId: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  oaId: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  trackingId: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  template_id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  note: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  submitDate: string;
  @Column({ default:null })
  rate: number;
  @Column({nullable:true,collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  feedbacks: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Dulieu: string;
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