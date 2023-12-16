import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(data: any) {
    const checkSDT = await this.findbySDT(data);
    const checkEmail = await this.findbyEmail(data);
    if (checkSDT) {
      return [false, 'Số Điện Thoại Đã Tồn Tại'];
    }
    if (checkEmail) {
      return [false, 'Email Đã Tồn Tại'];
    }
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    const validationCode = Math.floor(100000 + Math.random() * 900000);
    data.Code = validationCode;
    this.usersRepository.create(data);
    const newUser = await this.usersRepository.save(data);
    return [true, newUser]; 
  }
  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }
  async read(id: string) {
    return await this.usersRepository.findOne({where: { id: id }});
  }
  async findid(id: string) {
    return await this.usersRepository.findOne({where: { id: id }});
  }
  async findbyEmail(user: any) {
    return await this.usersRepository.findOne({ where: { email: user.email } });
  }
  async findSDT(sdt: any) {
    return await this.usersRepository.findOne({
      where: { SDT: sdt },
    });
  }
  async findbySDT(data: any) {
    return await this.usersRepository.findOne({where: { SDT: data.SDT }});
  }
  async findAdmin() {
    const admin = await this.usersRepository.find(
      {where: { Role: 'admin' }}
      );
    return admin
  }
  async update(id: string, data: Partial<UpdateUserDto>) {
    await this.usersRepository.save(data);
    return await this.read(id);
  }
  async remove(id: string) {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }

  async changepass(data: any): Promise<any> {
    const user = await this.read(data.id);
    if (!user) {
      throw new ConflictException('Tài Khoản Không Đúng');
    }
    const checkPass = await bcrypt.compare(data.oldpass, user.password);
    if (!checkPass) {
      throw new ConflictException('Mật Khẩu Không Trùng Khớp');
    }
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(data.newpass, salt);
    await this.usersRepository.update(user.id, user);
    return await this.usersRepository.save(user);
  }
}
