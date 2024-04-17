// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Like, Repository } from 'typeorm';
// import { VttechdieutriEntity } from './entities/vttechdieutri.entity';
// import moment = require('moment');
// import { SharedService } from '../../shared/shared.service';
// import { TelegramService } from '../../shared/telegram.service';
// @Injectable()
// export class VttechdieutriService {
//   constructor(
//     @InjectRepository(VttechdieutriEntity)
//     private VttechdieutriRepository: Repository<VttechdieutriEntity>,
//     private _SharedService: SharedService,
//     private _TelegramService: TelegramService,
//   ) { }
//   async getAPI(data: any = {}) {
//     const DataInit =
//     {
//       "DateFrom": "2024-04-09",
//       "DateTo": "2024-04-09",
//       "PagingNumber": "1",
//       "BranchID": "1",
//       "Name": "Taza",
//       "Password": "1b9287d492b256x7taza",
//       "Type": "web"
//   }
//     data.DateFrom = data?.DateFrom ? moment(data.DateFrom).format('YYYY-MM-DD') : DataInit.DateFrom;
//     data.DateTo = data?.DateTo ? moment(data.DateTo).format('YYYY-MM-DD') : DataInit.DateTo;
//     data.BranchID = data?.BranchID ? data.BranchID : DataInit.BranchID;
//     data.PagingNumber = data?.PagingNumber ? data.PagingNumber : DataInit.PagingNumber;
//     data.Name = data?.Name ? data.Name : DataInit.Name;
//     data.Password = data?.Password ? data.Password : DataInit.Password;
//     data.Type = data?.Type ? data.Type : DataInit.Type;
//     console.log(data);
//     const Token = await this._SharedService.getToken(data)
//     try {
//       const response = await fetch(`https://apismsvtt.vttechsolution.com/api/Customer/GetTreat`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json', 
//           'withCredentials': 'true',
//           credentials: 'include',
//           'Authorization': `Bearer ${Token[0].Token}`, 
//           'Cookie': Token[1],
//         },
//         body: JSON.stringify(data)
//       });
//       const result = await response.json();
//       if(result.Data.length > 0) { 
//         result.Data.forEach((v:any,k:any) => {
//           const item:any={}
//           item.idVttech = (new Date(v.CreatedDate)).getTime();
//           item.SDT = v.Phone;
//           item.ServiceCode = v.Service.ServiceCode;
//           item.Dulieu = v;
//           setTimeout(() => {
//             this.create(item);
//           }, k*300);
//         });
//       }    
//       return result
//     } catch (error) {
//       console.error(error.status);
//       this._TelegramService.SendMiniAppLogdev(`[VTTECH_THANHTOAN] - Lỗi Xác Thực - ${JSON.stringify(error.status)} - ${JSON.stringify(data)}`);
//       return error;
//     }
//   }
//   async create(data: any) {
//     const check = await this.findSHD(data)
//     if(!check) {
//       this.VttechdieutriRepository.create(data);
//       return await this.VttechdieutriRepository.save(data);
//     }
//     else {
//       return { error: 1001, data: "Trùng Dữ Liệu" }
//     }

//   }

//   async findAll() {
//     return await this.VttechdieutriRepository.find();
//   }
//   async findid(id: string) {
//     return await this.VttechdieutriRepository.findOne({ where: { id: id } });
//   }
//   async findSHD(data: any) {
//     return await this.VttechdieutriRepository.findOne({
//       where: {
//         SDT: data.SDT,
//         ServiceCode: data.ServiceCode,
//         idVttech: data.idVttech
//       },
//     });
//   }
//   async findslug(SDT: any) {
//     return await this.VttechdieutriRepository.findOne({
//       where: { SDT: SDT },
//     });
//   }
//   async findPagination(page: number, perPage: number) {
//     const skip = (page - 1) * perPage;
//     const totalItems = await this.VttechdieutriRepository.count();
//     const vttechdieutris = await this.VttechdieutriRepository.find({ skip, take: perPage });
//     return {
//       currentPage: page,
//       perPage,
//       totalItems,
//       totalPages: Math.ceil(totalItems / perPage),
//       data: vttechdieutris,
//     };
//   }
//   async findQuery(params: any) {
//     console.error(params);
//     const queryBuilder = this.VttechdieutriRepository.createQueryBuilder('vttechdieutri');
//     if (params.Batdau && params.Ketthuc) {
//       queryBuilder.andWhere('vttechdieutri.CreateAt BETWEEN :startDate AND :endDate', {
//         startDate: params.Batdau,
//         endDate: params.Ketthuc,
//       });
//     }
//     if (params.Title) {
//       queryBuilder.andWhere('vttechdieutri.Title LIKE :Title', { SDT: `%${params.Title}%` });
//     }
//     const [items, totalCount] = await queryBuilder
//       .limit(params.pageSize || 10) // Set a default page size if not provided
//       .offset(params.pageNumber * params.pageSize || 0)
//       .getManyAndCount();
//     console.log(items, totalCount);

//     return { items, totalCount };
//   }
//   async update(id: string, UpdateVttechdieutriDto: any) {
//     this.VttechdieutriRepository.save(UpdateVttechdieutriDto);
//     return await this.VttechdieutriRepository.findOne({ where: { id: id } });
//   }
//   async remove(id: string) {
//     console.error(id)
//     await this.VttechdieutriRepository.delete(id);
//     return { deleted: true };
//   }
// }
