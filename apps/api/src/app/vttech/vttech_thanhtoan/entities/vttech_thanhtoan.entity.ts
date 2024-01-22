export class VttechThanhtoan {}
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
@Entity('vttech_thanhtoan', { orderBy: { CreateAt: 'DESC' } })
export class Vttech_thanhtoanEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    Dulieu: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    InvoiceNum: string;
    @Column({default:null})
    checkTime: string;
    @Column({default:null})
    time: Date;
    @Column({default:null})
    DukienZNS: Date;
    @Column({default:null})
    ThucteZNS: Date;
    @Column({default:0})
    StatusZNS: number;
    @Column({default:null})
    TimeZNS: Date;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    ZNS: string;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    SMS: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    BranchID: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustomerID: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustOldCode: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustCode: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustName: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    DocCode: string;
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    Amount: number;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Source: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Service: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    ServiceCat: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    TabID: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Card: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Medicine: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Deposit: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Birth1: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Birth: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Gender: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    IsNew: string;
    @Column({ nullable: true })
    Created: Date;
    @Column({ nullable: true })
    DateCreated: Date;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Type: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    PaymentMethod: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    PaymentMethodTransfer: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    PaymentMethodPos: string;
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    PriceDiscounted: number;
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    Paid: number;
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    Debt: number
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
