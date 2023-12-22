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
@Injectable()
export class TasksService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private _ZaloznsService: ZaloznsService,
    private _TelegramService: TelegramService,
  ) { }
  // @Timeout('messaging', 3500)
  // handleNamedTimeout() {
  //   console.log("Calling method after 3.5 seconds based on named timeout.")
  // }
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

  // @Cron('4 * * * * *', {
  //     name: 'messaging',
  //     timeZone: 'Asia/Ho_Chi_Minh'
  // })
  // triggerMessage(){
  //     console.log("Triggering Message Sending");
  // }

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
    const targetDate = moment(data.time);
    const current = new Date(data.time)
    const now = new Date();
    const Homnay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const Ngaymai = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
    const CronNgaymai = moment(Ngaymai);
    let cronExpression: any;
    let teletime: any;
    if (current.getTime() <= Homnay.getTime()) {
      teletime = targetDate
      cronExpression = `0 ${targetDate.minute()} ${targetDate.hour()} ${targetDate.date()} ${targetDate.month() + 1} ${targetDate.isoWeekday()}`;
    }
    else {
      teletime = CronNgaymai
      //cronExpression = `0 ${targetDate.minute()} ${targetDate.hour()} ${targetDate.date()} ${targetDate.month() + 1} ${targetDate.isoWeekday()}`;
      cronExpression = `0 ${CronNgaymai.minute()} ${CronNgaymai.hour()} ${CronNgaymai.date()} ${CronNgaymai.month() + 1} ${CronNgaymai.isoWeekday()}`;
    }
    console.log('Cron expression :', cronExpression);
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == data.BranchID)
    if (Chinhanh) {
      // if (data.SDT == '0977272967') {
      //   console.log(data);
        const job = new CronJob(cronExpression, () => {
          const result = `ZNS <b><u>${data.id}</u></b> sẽ được gửi lúc ${data.teletime}`;
          this._TelegramService.SendLogdev(result)
          try {
            console.log(data,Chinhanh.idtoken,Chinhanh.idtemp);
            
            this._ZaloznsService.sendtestzns(data, Chinhanh.idtoken, Chinhanh.idtemp).then((zns: any) => {
             const result = `ZNS có message có id <b><u>${zns.data.msg_id}</u></b> đã được gửi`;
             this._TelegramService.SendNoti(result)
            })
          } catch (error) {
            console.error(`Error calling Zalozns service: ${error.message}`);
          }
        })
        this.schedulerRegistry.addCronJob(data.id, job);
        console.log("Send ZNS");   
        job.start();
        console.log("ZNS Start");  
      const result = `Zns Thanh Toán Số Hoá Đơn <b><u> ${data.InvoiceNum} </u></b> của khách hàng <b><u> ${data.CustName} </u></b> có số điện thoại <b><u>${data.SDT} </u></b> Thêm Vào Hàng Chờ Lúc <b><u>${teletime.format("HH:mm:ss DD/MM/YYYY")}</u></b>`;
      this._TelegramService.SendNoti(result)
      // }
      // else {
      //   console.log("Lỗi Số Điện Thoại");
      // }
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
