import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Index, CreateDateColumn, Generated } from 'typeorm';
@Entity('KhachhangDetail',{
  orderBy: {
    NgayTaoDV: "DESC"
  }
  })
export class ChitietEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
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