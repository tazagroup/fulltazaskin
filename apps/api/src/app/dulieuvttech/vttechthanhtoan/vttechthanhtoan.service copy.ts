import { Injectable } from '@nestjs/common';
import { CreateVttechthanhtoanDto } from './dto/create-vttechthanhtoan.dto';
import { UpdateVttechthanhtoanDto } from './dto/update-vttechthanhtoan.dto';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class VttechthanhtoanService {
  // // @Interval(10000) 
  // //call every time
  // @Timeout(1000)
  // //call once time
  // //@Timeout('notifications', 1000)
  // async handleCron() {
  //   console.error("tessting");
  //     const options = {
  //       url: 'https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=0&dateFrom=08-12-2023&dateTo=08-12-2023',
  //       headers: {
  //         "Xsrf-Token": "CfDJ8P2UtwwrDOpPs_qllQGuX-J4G5cW9ZIjuuj67lHpfodhiMT3nmjjIyQvuW4SWioorni5xB188Wz90AJfUF9nXCg3Qdxl-VKmeosfbUXDWfz1nt8UAXfUUp16USbdMIxbCHhntINVlJ8qhls1Z_cVOmQ",
  //         "Cookie": ".AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN; _ga=GA1.1.1456326643.1691977621; _fbp=fb.1.1691977621911.703803527; _gcl_au=1.1.210932540.1700097971; .AspNetCore.Antiforgery.yCr0Ige0lxA=CfDJ8P2UtwwrDOpPs_qllQGuX-JMVgPNSAb6CaKHdU_90XTcSYfRWFFfGnn1_NGcDw-Z9qpyOV4EriNSCq5w_3Tv2LvovGGqPcoDy0GQ-FT163djgwxzjAxX7megmqtLjSZYnO7wAkVEDfptccYRA1HPr3U; .AspNetCore.Session=CfDJ8P2UtwwrDOpPs%2FqllQGuX%2BL%2BFntzAWNSxmMpnrnBCcrAuTTwIKF2jsAsqTrXh9zhPHScFayF2%2BLwsFYpMZJFiOiDQP%2BQO2ytWtvJsOzvA4a0AMT1zJ73MqAND8mQHzaHRk5SbOulw3nz7f%2BLShYf6uspR2DtYeqkAo7WUj6%2BRSPC; VTTECH_Menu_SideBarIsHide=false; _ga_P3LS0098CH=GS1.1.1701999215.27.0.1701999958.0.0.0; WebToken=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpa2lldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IndlYmFwcCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiMzU5NjkzNGItYWM5OS00NzRmLWJjZDgtODVjNDdiOTcwMjQ5IiwiZXhwIjoxNzAyMDU2OTQyLCJpc3MiOiJ2dHRlY2hzb2x1dGlvbiIsImF1ZCI6InZ0dGVjaHNvbHV0aW9uIn0.4fbzF2wfi9yii0uBbe-TylIlqac7donM3hS8xoIVPEU",
  //       },
  //     };
  //     const response = await axios.post(options.url, { headers: options.headers });
  //     console.error(response);
      
  //    // return response.data;
  // }
  // @Interval(10000) 
  //call every time
  @Timeout(1000)
  //call once time
  //@Timeout('notifications', 1000)
  async getApiRealtime() {
    console.error("tessting");
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Report/Revenue/Branch/AllBranchGrid/?handler=LoadataDetailByBranch&branchID=0&dateFrom=08-12-2023&dateTo=08-12-2023',
      headers: { 
        'Cookie': '.AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN; _ga=GA1.1.1456326643.1691977621; _fbp=fb.1.1691977621911.703803527; _gcl_au=1.1.210932540.1700097971; .AspNetCore.Antiforgery.yCr0Ige0lxA=CfDJ8P2UtwwrDOpPs_qllQGuX-JMVgPNSAb6CaKHdU_90XTcSYfRWFFfGnn1_NGcDw-Z9qpyOV4EriNSCq5w_3Tv2LvovGGqPcoDy0GQ-FT163djgwxzjAxX7megmqtLjSZYnO7wAkVEDfptccYRA1HPr3U; .AspNetCore.Session=CfDJ8P2UtwwrDOpPs%2FqllQGuX%2BL%2BFntzAWNSxmMpnrnBCcrAuTTwIKF2jsAsqTrXh9zhPHScFayF2%2BLwsFYpMZJFiOiDQP%2BQO2ytWtvJsOzvA4a0AMT1zJ73MqAND8mQHzaHRk5SbOulw3nz7f%2BLShYf6uspR2DtYeqkAo7WUj6%2BRSPC; VTTECH_Menu_SideBarIsHide=false; _ga_P3LS0098CH=GS1.1.1701999215.27.0.1701999958.0.0.0; WebToken=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpa2lldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IndlYmFwcCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiMzU5NjkzNGItYWM5OS00NzRmLWJjZDgtODVjNDdiOTcwMjQ5IiwiZXhwIjoxNzAyMDU2OTQyLCJpc3MiOiJ2dHRlY2hzb2x1dGlvbiIsImF1ZCI6InZ0dGVjaHNvbHV0aW9uIn0.4fbzF2wfi9yii0uBbe-TylIlqac7donM3hS8xoIVPEU', 
        'Xsrf-Token': 'CfDJ8P2UtwwrDOpPs_qllQGuX-J4G5cW9ZIjuuj67lHpfodhiMT3nmjjIyQvuW4SWioorni5xB188Wz90AJfUF9nXCg3Qdxl-VKmeosfbUXDWfz1nt8UAXfUUp16USbdMIxbCHhntINVlJ8qhls1Z_cVOmQ'
      }
    };
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
      
     // return response.data;
  }
  create(createVttechthanhtoanDto: CreateVttechthanhtoanDto) {
    return 'This action adds a new vttechthanhtoan';
  }

  findAll() {
    return `This action returns all vttechthanhtoan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttechthanhtoan`;
  }

  update(id: number, updateVttechthanhtoanDto: UpdateVttechthanhtoanDto) {
    return `This action updates a #${id} vttechthanhtoan`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttechthanhtoan`;
  }
}
