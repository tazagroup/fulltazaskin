import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Index, CreateDateColumn, Generated, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent, UpdateDateColumn } from 'typeorm';
@Entity('cauhinh', {orderBy: { CreateAt: "DESC" }})
export class CauhinhEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ collation: "utf8_general_ci" })
    Title: string;
    @Column({ collation: "utf8_general_ci" })
    Slug: string;
    @Column({ type: "longtext", collation: "utf8_general_ci" })
    Mota: string;
    @Column({ type: "longtext", collation: "utf8_general_ci" })
    Content: string;
    @Column({ collation: "utf8_general_ci", type: "simple-json", default: () => "('[]')" })
    Data: string;
    @Column({ collation: "utf8_general_ci" })
    Branch: string;
    @Column({ default: 1 })
    Ordering: number;
    @Column({ default: 0 })
    Trangthai: number;
    @CreateDateColumn()
    CreateAt: Date;
    @UpdateDateColumn()
    UpdateAt: Date;
    @Column({ nullable: true })
    idTao: string;
}
