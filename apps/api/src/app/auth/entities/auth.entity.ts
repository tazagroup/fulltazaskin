// import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Index, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
// @Entity("users",{orderBy: {Ngaytao: "DESC"}})
// export class UsersEntity {
//     @PrimaryGeneratedColumn("uuid")
//     id: string;
//     @Column({collation: "utf8_general_ci"})
//     name: string;
//     @Column()
//     SDT: string;
//     @Column({collation: "utf8_general_ci"})
//     email: string;
//     @Column({collation: "utf8_general_ci",nullable: true})
//     avatar: string;
//     @Column()
//     password: string;
//     @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
//     profile: string;
//     @Column({type: 'enum', enum: Role, default: Role.User})
//     Role: string;
//     @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
//     Phanquyen: string;
//     @Column({collation: "utf8_general_ci",type:"simple-json",default: () => "('{}')" })
//     Menu: string;
//     @Column({default:0})
//     Trangthai: number;
//     @CreateDateColumn()
//     Ngaytao: Date;
//     @BeforeInsert()
//     emailToLowerCase() {
//         this.email = this.email.toLowerCase();
//     }
//  }
//  export interface UsersDTO {
//   id: string;
//   SDT: string;
//   name: string;
//   email: string;
//   password: string;
//   avatar: string;
//   profile: string;
//   Ngaytao: Date;
//   Role:string;
//   Phanquyen:string;
//   Menu:string;
//   Trangthai:number;
// }
// export enum Role {
//   Admin = 'admin',
//   Manager = 'manager',
//   User = 'user',
//   Dev = 'dev',
//   Iso = 'iso',
// }
