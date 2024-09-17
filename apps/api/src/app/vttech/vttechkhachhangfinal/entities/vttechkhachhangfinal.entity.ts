import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('vttechkhachhangfinal', {orderBy: { CreateAt: 'DESC' } })
export class VttechkhachhangfinalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  idKH: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  Dieutri: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  Thanhtoan: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
  Lichhen: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustCode: string;
  @Column({ default: '' })
  Type: string;
  @Column({ default: 1 })
  Ordering: number;
  @Column({ default: 0 })
  Status: number;
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
