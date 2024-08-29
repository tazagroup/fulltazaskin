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
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    idVttech: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustPhone: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    CustCode: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Code: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    TabCode: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    TypeName: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    BranchID: string;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    Dulieu: string
    @Column({ default: 1 })
    Ordering: number;
    @Column({ default: 0 })
    Status: number;
    @Column({ default: 0 })
    State: number;
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
