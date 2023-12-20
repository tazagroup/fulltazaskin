import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';
import { VttechthanhtoanEntity } from './entities/vttechthanhtoan.entity';
import axios from 'axios';
import { Cron, Interval } from '@nestjs/schedule';
import { CauhinhchungService } from '../../cauhinh/cauhinhchung/cauhinhchung.service';
import { environment } from 'apps/api/src/environments/environment';
import * as moment from 'moment';
import { TasksService } from '../../tasks/tasks.service';
@Injectable()
export class VttechthanhtoanService {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    @InjectRepository(VttechthanhtoanEntity)
    private VttechthanhtoanRepository: Repository<VttechthanhtoanEntity>,
    private _CauhinhchungService: CauhinhchungService,
    private _TasksService: TasksService,
  ) {
    this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }
  // async getApiRealtime() {
  //   const begin = moment(new Date()).format("DD-MM-YYYY")
  //   const end = moment(new Date()).add(1, 'day').format("DD-MM-YYYY")
  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: `https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=0&dateFrom=${begin}&dateTo=${end}`,
  //     headers: { 
  //       'Cookie': this.Cookie, 
  //       'Xsrf-Token': this.XsrfToken
  //     }
  //   };
  //   return axios.request(config)
  //   .then((response) => {   
  //     const data1 = response.data      
  //     this.findAll().then((data)=>
  //     {
  //       const data2 = data.map((obj) => ({
  //         ...obj,
  //       }));
  //       const uniqueInData2 = data1.filter(
  //         (item:any) => !data2.some((data1Item:any) => this.Getdatetime(data1Item.Created)==(this.Getdatetime(item.Created)))
  //       );      
  //       if(uniqueInData2.length>0)
  //       {
  //         uniqueInData2.forEach((v:any) => {
  //           console.error(v);

  //         this.create(v)
  //       })}
  //       const result =`Cập Nhật Lúc <b><u>${moment(new Date()).format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng : <b><u>${uniqueInData2.length}</u></b>`
  //       this.SendTelegram(result)
  //     }) 
  //    return ({status:200});
  //   })
  //   .catch((error) => {
  //     const result =`Lỗi Xác Thực Lúc <b><u>${moment(new Date()).format("HH:mm:ss DD/MM/YYYY")}</u></b>`
  //     this.SendTelegram(result)
  //     return ({status:400});
  //   });
  // }

  async getApiRealtime() {
    console.log('todo');
    
    const begin = moment(new Date()).format("DD-MM-YYYY")
    const end = moment(new Date()).add(1, 'day').format("DD-MM-YYYY")
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=0&dateFrom=${begin}&dateTo=${end}`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      const data1 = response.data;
      const data2 = await this.findAll();
      const uniqueInData2 = data1.filter((item: { Created: any; }) => !data2.some((data1Item) => this.Getdatetime(data1Item.Created) === this.Getdatetime(item.Created)));

      if (uniqueInData2.length > 0) {
        await Promise.all(uniqueInData2.map((v: any) => {
          this.create(v).then((item: any) => {
            console.log(item);
            this.GetVttechKhachhang(item)})
        }));
        const result = `Cập Nhật Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b> Với Số Lượng: <b><u>${uniqueInData2.length}</u></b>`;
        this.SendTelegram(result);
        return { status: 201 };
      }
      return { status: 200 };
    } catch (error) {
      const result = `Lỗi Xác Thực Lúc <b><u>${moment().format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      this.SendTelegram(result);
      return { status: 400 };
    }
  }
  async GetVttechKhachhang(item:any) {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=[{"name":"CUST_CODE","value":"'+item.CustCode+'"}]',
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    try {
      const response = await axios.request(config);
      console.log(response.data);
      const item1 = {...item,time:moment(new Date(item.Created)).add(1, 'hours'),SDT:response.data.Table[0].CustomerPhone } 
      // { idKH: item.id, time: moment(new Date(item.Created)).add(1, 'hours'),SDT:response.data.Table[0].CustomerPhone }
      this._TasksService.addCron(item1)
     // return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  Getdatetime(data: any) {
    const date1 = new Date(data);
    return date1.getTime()
  }
  async create(CreateVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    this.VttechthanhtoanRepository.create(CreateVttechthanhtoanDto);
    return await this.VttechthanhtoanRepository.save(CreateVttechthanhtoanDto);
  }

  async findAll() {
    return await this.VttechthanhtoanRepository.find();
  }
  async findid(id: string) {
    return await this.VttechthanhtoanRepository.findOne({
      where: { id: id },

    });
  }
  async findslug(slug: any) {
    return await this.VttechthanhtoanRepository.findOne({
      where: { CustName: slug },
    });
  }
  async findPagination(page: number, perPage: number) {
    const skip = (Number(page) - 1) * Number(perPage);
    const totalItems = await this.VttechthanhtoanRepository.count();
    const vttechthanhtoans = await this.VttechthanhtoanRepository.find({ skip: skip, take: perPage });
    return {
      currentPage: page,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      data: vttechthanhtoans,
    };
  }
  async findQuery(query: string) {
    return await this.VttechthanhtoanRepository.find({
      where: { CustName: Like(`%query%`) },
    });
  }
  async update(id: string, UpdateVttechthanhtoanDto: UpdateVttechthanhtoanDto) {
    this.VttechthanhtoanRepository.save(UpdateVttechthanhtoanDto);
    return await this.VttechthanhtoanRepository.findOne({ where: { id: id } });
  }
  async remove(id: string) {
    // console.error(id)
    await this.VttechthanhtoanRepository.delete(id);
    return { deleted: true };
  }
  async SendTelegram(data: string): Promise<any> {
    const options = {
      url: `https://api.telegram.org/bot${environment.APITelegram_accesstoken}/sendMessage?chat_id=${environment.APITelegram_idGroup}&text=${data}&parse_mode=html`,
    };
    const response = await axios.post(options.url);
    return response.data;
  }
}
