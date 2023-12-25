import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, CronExpression, SchedulerRegistry, Timeout } from '@nestjs/schedule';
// import { CronJob } from 'cron';
import { CronJob } from '@nestjs/schedule/node_modules/cron/dist/job';
import * as moment from 'moment';
import { ZaloznsService } from '../zalo/zalozns/zalozns.service';
import { LIST_CHI_NHANH } from '../shared.utils';
import { environment } from '../../environments/environment';
import axios from 'axios';
import { TelegramService } from '../shared/telegram.service';
import { VttechthanhtoanService } from '../dulieuvttech/vttechthanhtoan/vttechthanhtoan.service';
@Injectable()
export class TasksService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private _ZaloznsService: ZaloznsService,
    private _TelegramService: TelegramService,
    private _VttechthanhtoanService: VttechthanhtoanService,
  ) { }
  async getThanhtoan() {
    const now = new Date()
    const Start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const End = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const Thanhtoanpromise = await this._VttechthanhtoanService.findbetween(Start, End)
    const [Thanhtoan] = await Promise.all([Thanhtoanpromise])
    if (Thanhtoan.length>0) {
      Thanhtoan.forEach((v: any) => {
       this.addCron(v)
      });
      console.error(Thanhtoan);
      return Thanhtoan
    }
    else { return {Title:"Không Có Thanh Toán Mới"}}

  }

  listTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach(key => console.log(`Timeout Name: ${key}`))
  }
  clearTimeout() {
    const timeout = this.schedulerRegistry.getTimeout('messaging');
    clearTimeout(timeout);
  }
  addNewTimeout(data: any) {
    //timeoutName: string, milliseconds: number
    const callback = () => {
      console.log(`Timeout ${data.timeoutName} executing after ${data.milliseconds}`);
    }

    const timeout = setTimeout(callback, data.milliseconds);
    this.schedulerRegistry.addTimeout(data.timeoutName, timeout);
  }
  deleteTimeout(timeoutName: string) {
    this.schedulerRegistry.deleteTimeout(timeoutName);
  }

  stopCronJob() {
    const job = this.schedulerRegistry.getCronJob('messaging');
    job.stop();
    console.log(job.lastDate());
  }
  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    return jobs
    jobs.forEach((value, key, map) => {
      console.log("Value:", value);
    })
  }
  addCron(data: any) {
    let cronExpression: any;
    console.error(data);
    const targetDate = moment(data.ZNS.Dukien);
    cronExpression = `0 ${targetDate.minute()} ${targetDate.hour()} ${targetDate.date()} ${targetDate.month() + 1} ${targetDate.isoWeekday()}`;
    console.error(cronExpression);
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == data.BranchID)
    if (Chinhanh) {
      const job = new CronJob(cronExpression, () => {
        console.error('Đã Gửi');
        const result = `ZNS <b><u>${data.id}</u></b> sẽ được gửi lúc ${data.teletime}`;
        this._TelegramService.SendLogdev(result)
        try {
          console.log(data, Chinhanh.idtoken, Chinhanh.idtemp);
          this._ZaloznsService.sendtestzns(data, Chinhanh.idtoken, Chinhanh.idtemp).then((zns: any) => {
            if (zns) {
              if (zns.status == 'sms') {
                data.sms = zns.data
                this._VttechthanhtoanService.update(data.id, data)
              }
              else {
                data.ZNZ.Thucte = new Date()
                this._VttechthanhtoanService.update(data.id, data)
              }
              const result = `<b><u>${zns?.Title}</u></b>`;
              this._TelegramService.SendNoti(result)
            }

          })
        } catch (error) {
          console.error(`Error calling Zalozns service: ${error.message}`);
        }
      })
      this.schedulerRegistry.addCronJob(data.id, job);
      job.start();
      data.Status = 1
      this._VttechthanhtoanService.update(data.id, data)
      const result = `Zns Thanh Toán Số Hoá Đơn <b><u> ${data.InvoiceNum} </u></b> của khách hàng <b><u> ${data.CustName} </u></b> có số điện thoại <b><u>${data.SDT} </u></b> Thêm Vào Hàng Chờ Lúc <b><u>${targetDate.format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      this._TelegramService.SendNoti(result)
    }
    else {
      const result = `Chi nhánh chưa đăng ký ZNS`;
      this._TelegramService.SendLogdev(result)
    }
  }
  deleteJob(idKH: string) {
    this.schedulerRegistry.deleteCronJob(idKH);
  }
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
