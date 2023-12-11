// import { Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// // import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService

//   ) {}
//   async login(user:any): Promise<any> {
//     const data = await this.usersService.findbySDT(user); 
//     if(!data) {
//       return [false,'Số Điện Thoại Chưa Đăng Ký']
//     }
//     else
//     {
//       const compare = await bcrypt.compare(user.password, data.password);
//       if (!compare) {
//         return [false,'Sai Mật Khẩu']
//       }
//       else
//       {
//       const doLogin = {access_token: this.jwtService.sign({SDT: data.SDT,email: data.email}),data}
//       return [true,doLogin]
//       }
//     }
//     // else if(data.Status==0)
//     // {
//     //   return [false,'Tài Khoản Đã Bị Khóa']
//     // }
//   }
//   async changepass(data): Promise<any>{
//     const user = await this.usersService.findbySDT(data.user);
//     const compare = await bcrypt.compare( data.oldpass,user.password);
//     if (!compare) {
//       return [false,'Sai Mật Khẩu']
//     }
//     else
//     {
//       const salt = await bcrypt.genSalt();
//       user.password = await bcrypt.hash(data.newpass, salt);
//       await this.usersService.update(user.id,user)
//       return [true,"Đổi Mật Khẩu Thành Công"]
//     }
//   }
//   async randompass(data): Promise<any>{
//     const user = await this.usersService.findbySDT(data);
//       const salt = await bcrypt.genSalt();
//       const random = Math.random().toString(36).slice(-8);
//       user.password = await bcrypt.hash(random, salt);
//       const result = await this.usersService.update(user.id,user)
//       return [true,random]
//   }
//   async validateUser(user:any): Promise<any> {
//     const data = await this.usersService.findbySDT(user);
//     const compare = await bcrypt.compare(user.password, data.password);
//     if (data && compare) {
//      // const { password, ...result } = user;
//      console.log(data);

//      // return data;
//     }
//     return null;
//   }
// }
