import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
@Entity('vttechlichhen', {orderBy: { CreateAt: 'DESC' } })
export class VttechlichhenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  VttechID: string;
  @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
  Dulieu: string
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Code: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustID: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustCode: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  CustName: string;
  @Column()
  DateFrom: Date;
  @Column()
  CreatedDate: Date;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  StatusID: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  StatusName: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  BranchID: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  BranchName: string;
  @Column({ type: 'text', collation: 'utf8_general_ci' })
  Content: string;
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
