import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('khachhangchitiet', {orderBy: { CreateAt: 'DESC' } })
export class KhachhangchitietEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  pid: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Title: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Mota: string;
  @Column({ default: '' })
  Slug: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Hinhanh: string;
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
  @Column({collation: "utf8_general_ci"})
  TenKH: string;
  @Column({collation: "utf8_general_ci"})
  Dichvu: string;
  @Column({nullable: true})
  SDT:string;
  @Column({nullable: true})
  SDT2:string;
  @Column()
  Doanhso: number;
  @Column()
  Tonglieutrinh: number;
  @Column()
  Dathu: number;
  @Column({type: 'datetime',nullable: true})
  NgayTaoDV: Date;
  @Column({collation: "utf8_general_ci"})
  Ghichu: string;
  @Column({collation: "utf8_general_ci"})
  Chinhanh: string;
  @CreateDateColumn()
  Ngaytao: Date;
}