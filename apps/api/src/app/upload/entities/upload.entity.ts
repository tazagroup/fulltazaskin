
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('upload', {orderBy: { CreateAt: 'DESC' } })
export class UploadEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    Title: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    spath: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    url: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    Lienket: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    pathmobile: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    name: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    idDrive: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    alt: string;
    @Column({ type: "text", collation: "utf8_general_ci" ,nullable: true })
    Mime: string;
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
