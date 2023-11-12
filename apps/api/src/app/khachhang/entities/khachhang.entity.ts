import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';
@Entity('khachhang', {orderBy: { CreateAt: 'DESC' } })
export class KhachhangEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    idZalo: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Hoten: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Mota: string;
    @Column()
    Doanhthu: number;
    @Column()
    Doanhso: number;
    @Column()
    Congno: number;
    @Column({ collation: "utf8_general_ci", type: "simple-json", default: () => "('{}')" })
    Hangthanhvien: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    idCN: string;
    @Column({ default: '' })
    pid: string;
    @Column({ default: 0 })
    Status: number;
    @Column({ default: 1 })
    Ordering: number;
    @Column({ default: 0 })
    Trangthai: number;
    @CreateDateColumn()
    CreateAt: Date;
    @Column({ nullable: true })
    idTao: string;
}
