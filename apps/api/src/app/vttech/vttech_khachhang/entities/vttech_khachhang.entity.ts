import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  @Entity('vttech_khachhang', {orderBy: { CreateAt: 'DESC' } })
  export class Vttech_khachhangEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    Hoten: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    SDT: string;
    @Column({ type: 'text', collation: 'utf8_general_ci' })
    idCN: string;
    @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
    Dulieu: string;
    @Column({ default: '' })
    Type: string;
    @Column({ default: 1 })
    Ordering: number;
    @Column({ default: 0 })
    Status: number;
    @Column({default:null})
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