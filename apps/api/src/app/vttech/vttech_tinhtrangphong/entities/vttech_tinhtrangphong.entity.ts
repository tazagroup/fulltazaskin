import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('vttech_tinhtrangphong', {orderBy: { CreateAt: 'DESC' } })
export class Vttech_tinhtrangphongEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustCode: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustID: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Mota: string;
  @Column({ default: '' })
  Slug: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Dulieu: string;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 1 })
  Ordering: number;
  @Column({ default: 0 })
  Status: number;
  @Column({ nullable: true })
  BeginTime: Date;
  @CreateDateColumn()
  CreateAt: Date;
  @UpdateDateColumn()
  UpdateAt: Date;
  @DeleteDateColumn()
  DeleteAt: Date;
  @Column({ nullable: true })
  idCreate: string;
}