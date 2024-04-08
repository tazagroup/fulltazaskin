import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
@Entity('vttechthanhtoan', { orderBy: { CreateAt: 'DESC' } })
export class VttechthanhtoanEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    Dulieu: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    InvoiceNum: string;
    @Column({ type: 'bigint'})
    Amount: number;
    @Column({default:null})
    Created: Date;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    MethodName: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    BranchCode: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    BranchName: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    TypePayment: string;
    @Column()
    BranchID: number;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('[]')" })
    children: string;
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
