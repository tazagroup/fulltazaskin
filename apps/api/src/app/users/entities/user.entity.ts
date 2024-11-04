import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from '../dto/create-user.dto';
@Entity('users', {orderBy: { CreateAt: 'DESC' } })
export class UsersEntity {
 @PrimaryGeneratedColumn("uuid")
 id: string;
 @Column({ nullable: true,default:'0'})
 ref_id: string;
 @Column()
 gid: string;
 @Column()
 fid: string;
 @Column()
 zid: string;
 @Column()
 pid: string;
 @Column()
 SDT: string;
 @Column()
 idGroup: string;
 @Column()
 Code: string;
 @Column()
 Hoten: string;
 @Column()
 email: string;
 @Column({ type: "text"})
 Gioitinh: string;
 @Column({type:"simple-json",default: () => "('[]')" })
 EditChinhanhs: string;
 @Column({type:"simple-json",default: () => "('[]')" })
 Diachi: string;
 @Column()
 password: string;
 @Column({type:"simple-json",default: () => "('[]')" })
 ListImage: string;
 @Column({type:"simple-json",default: () => "('[]')" })
 Profile: string;
 @Column({type: 'enum', enum: Role, default: Role.User})
 Role: string;
 @Column({type:"simple-json",default: () => "('[]')" })
 Phanquyen: string;
 @Column({type:"simple-json",default: () => "('[]')" })
 Menu: string;
 @Column({type:"simple-array"})
 fcmToken: string[];
 @Column({ default: '' })
 Type: string;
 @Column({ default: 1 })
 Ordering: number;
 @Column({ default: false })
 idDelete: boolean;
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