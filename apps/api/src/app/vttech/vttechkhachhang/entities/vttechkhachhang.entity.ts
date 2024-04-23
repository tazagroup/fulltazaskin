import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
@Entity('vttechkhachhang', { orderBy: { CreateAt: 'DESC' } })
export class VttechkhachhangEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    idVttech: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Code: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Name: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    BranchID: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT2: string;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    Dulieu: string
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
