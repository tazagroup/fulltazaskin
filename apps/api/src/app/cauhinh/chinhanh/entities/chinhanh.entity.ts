import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('chinhanh', {orderBy: { CreateAt: 'DESC' } })
export class ChinhanhEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Title: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Address: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Linkmap: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Opentime: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Desc: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  ListSocial: string;
  @Column({ default: '' })
  Slug: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Image: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  ListImage: string;
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