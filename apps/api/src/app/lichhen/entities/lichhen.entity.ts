import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('lichhen', {orderBy: { CreateAt: 'DESC' } })
export class LichhenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  MaDH: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  idKH: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  idCN: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  idNV: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  idDV: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  HotenKhac: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  SDTKhac: string;
  @Column()
  Ngaydatlich: Date;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Title: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Ghichu: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Mota: string;
  @Column({ default: '' })
  Slug: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Image: string;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 0 })
  State: number;
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