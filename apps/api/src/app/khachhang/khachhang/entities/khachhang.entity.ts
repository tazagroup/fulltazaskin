import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Index, CreateDateColumn, Generated } from 'typeorm';
@Entity('khachhangs',{
  orderBy: {
      Ngaytao: "DESC"
  }
  })
export class KhachhangEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({collation: "utf8_general_ci"})
    TenKH: string;
    @Column({nullable: true})
    SDT:string;
    @Column({nullable: true})
    SDT2:string;
    @Column()
    Dathu: number;
    @Column({ collation: "utf8_general_ci", type: "simple-json", default: () => "('{}')" })
    Hangthanhvien: string;
    @Column({type: 'datetime',nullable: true})
    Ghichu: string;
    @Column({collation: "utf8_general_ci"})
    Chinhanh: string;
    @Column({type: 'datetime',nullable: true})
    NgayMD: Date;
    @Column({collation: "utf8_general_ci"})
    NoiMD: string;
    @Column({type: 'datetime',nullable: true})
    NgayMC: Date;
    @Column({collation: "utf8_general_ci"})
    NoiMC: string;
    @CreateDateColumn()
    Ngaytao: Date;   
 }