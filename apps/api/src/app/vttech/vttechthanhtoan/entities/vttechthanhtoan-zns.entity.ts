import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
@Entity('vttechthanhtoan_zns', { orderBy: { TimeZNS: 'DESC' } })
export class VttechthanhtoanZNSEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustName: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    BranchID: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Gender: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT: string;
    @Column({default:null})
    TimeZNS: Date;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    InvoiceNum: string;
    @Column({ nullable: true })
    Created: Date;
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    Amount: number;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    SMS: string;
    @Column({default:0})
    StatusZNS: number;
    @Column({ nullable: true })
    DateCreated: Date;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
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
