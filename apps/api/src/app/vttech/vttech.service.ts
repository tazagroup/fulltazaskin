import { Injectable } from '@nestjs/common';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
const axios = require('axios');
@Injectable()
export class VttechService {
  GetKHBySDT(data: any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=%5B%7B%22name%22%3A%22PHONENUMBER%22%2C%22value%22%3A%22' + data + '%22%7D%5D&CBeginID=0',
      headers: {
        'Cookie': '.AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN; _ga=GA1.1.1693983903.1702130461; _gcl_au=1.1.564538461.1702130462; _fbp=fb.1.1702130462017.237325101; _ga_P3LS0098CH=GS1.1.1702661869.3.0.1702661872.0.0.0; .AspNetCore.Antiforgery.yCr0Ige0lxA=CfDJ8P2UtwwrDOpPs_qllQGuX-J9Muhx8f6v92DkhvYfw-lXRsJL7Hh-J0B5hmWIEqX50mYZ2NXD4LMKQtnbWhHvUWEyHEmRF7k2UN89ngOkIlfOCRSZgtFdih2yXkk1syCISgqhWcJ43jV-BeBZtjv82zw; .AspNetCore.Session=CfDJ8P2UtwwrDOpPs%2FqllQGuX%2BKyuEHat7VraqqB25cj2XHk4LI1wTwxY3DUrrbZ%2BFJO%2FvsGkwa0G1ivqhKpvXPps36zdGYq9KnR6WPXTGtOpGfSAIRWLBt9TTubmGEYHGf4Q57z9eBYP4oVRS2rTzerIEuVn1EzRdkZ9nqhRpVB7YjF; WebToken=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpa2lldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IndlYmFwcCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiYzdlM2VkOTMtODE0OS00MmI3LTlkZTUtNGQwMjZlYzVmYzNkIiwiZXhwIjoxNzAyOTE0ODgyLCJpc3MiOiJ2dHRlY2hzb2x1dGlvbiIsImF1ZCI6InZ0dGVjaHNvbHV0aW9uIn0.f3ikCqc_ba8phh3Uq4SClVP0JnJJ__WImLn4isRhoUg; VTTECH_Menu_SideBarIsHide=false',
        'Xsrf-Token': 'CfDJ8P2UtwwrDOpPs_qllQGuX-IK0LU2rTt98Sctmui3SC3p3lmb5ftk4nYpRFDbbXzXTLpNPc42nb0_Jo3g0bbd6K3yyBUfYBXCVJ8I7K2PiKM2KCQnPLX_rYdRCUcUqIlOKQ_LkO7Go7bVykutERc-jNE'
      }
    };
    return axios.request(config)
      .then((response: { data: any; }) => {
        return response.data
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  GetDichVu(CustomerID:any) {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Customer/Service/TabList/TabList_Service/?handler=LoadataTab&CustomerID='+CustomerID+'&Record=0&Plan=0&ViewAll=1',
      headers: {
        'Cookie': '.AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN; _ga=GA1.1.1693983903.1702130461; _gcl_au=1.1.564538461.1702130462; _fbp=fb.1.1702130462017.237325101; _ga_P3LS0098CH=GS1.1.1702661869.3.0.1702661872.0.0.0; .AspNetCore.Antiforgery.yCr0Ige0lxA=CfDJ8P2UtwwrDOpPs_qllQGuX-J9Muhx8f6v92DkhvYfw-lXRsJL7Hh-J0B5hmWIEqX50mYZ2NXD4LMKQtnbWhHvUWEyHEmRF7k2UN89ngOkIlfOCRSZgtFdih2yXkk1syCISgqhWcJ43jV-BeBZtjv82zw; .AspNetCore.Session=CfDJ8P2UtwwrDOpPs%2FqllQGuX%2BKyuEHat7VraqqB25cj2XHk4LI1wTwxY3DUrrbZ%2BFJO%2FvsGkwa0G1ivqhKpvXPps36zdGYq9KnR6WPXTGtOpGfSAIRWLBt9TTubmGEYHGf4Q57z9eBYP4oVRS2rTzerIEuVn1EzRdkZ9nqhRpVB7YjF; WebToken=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpa2lldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IndlYmFwcCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiYzdlM2VkOTMtODE0OS00MmI3LTlkZTUtNGQwMjZlYzVmYzNkIiwiZXhwIjoxNzAyOTE0ODgyLCJpc3MiOiJ2dHRlY2hzb2x1dGlvbiIsImF1ZCI6InZ0dGVjaHNvbHV0aW9uIn0.f3ikCqc_ba8phh3Uq4SClVP0JnJJ__WImLn4isRhoUg; VTTECH_Menu_SideBarIsHide=false',
        'Xsrf-Token': 'CfDJ8P2UtwwrDOpPs_qllQGuX-IK0LU2rTt98Sctmui3SC3p3lmb5ftk4nYpRFDbbXzXTLpNPc42nb0_Jo3g0bbd6K3yyBUfYBXCVJ8I7K2PiKM2KCQnPLX_rYdRCUcUqIlOKQ_LkO7Go7bVykutERc-jNE'
      }
    };

    return axios.request(config)
      .then((response: { data: any; }) => {
        return response.data
      })
      .catch((error: any) => {
        console.log(error);
      });

  }
  GetLichhen(CustomerID:any) {
       let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://tmtaza.vttechsolution.com/Customer/ScheduleList_Schedule/?handler=Loadata&CustomerID='+CustomerID+'&Limit=10&BeginID=0&IsDelete=0',
        headers: { 
          'Cookie': '.AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN; _ga=GA1.1.1693983903.1702130461; _gcl_au=1.1.564538461.1702130462; _fbp=fb.1.1702130462017.237325101; _ga_P3LS0098CH=GS1.1.1702661869.3.0.1702661872.0.0.0; .AspNetCore.Antiforgery.yCr0Ige0lxA=CfDJ8P2UtwwrDOpPs_qllQGuX-J9Muhx8f6v92DkhvYfw-lXRsJL7Hh-J0B5hmWIEqX50mYZ2NXD4LMKQtnbWhHvUWEyHEmRF7k2UN89ngOkIlfOCRSZgtFdih2yXkk1syCISgqhWcJ43jV-BeBZtjv82zw; .AspNetCore.Session=CfDJ8P2UtwwrDOpPs%2FqllQGuX%2BKyuEHat7VraqqB25cj2XHk4LI1wTwxY3DUrrbZ%2BFJO%2FvsGkwa0G1ivqhKpvXPps36zdGYq9KnR6WPXTGtOpGfSAIRWLBt9TTubmGEYHGf4Q57z9eBYP4oVRS2rTzerIEuVn1EzRdkZ9nqhRpVB7YjF; WebToken=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpa2lldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IndlYmFwcCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiYzdlM2VkOTMtODE0OS00MmI3LTlkZTUtNGQwMjZlYzVmYzNkIiwiZXhwIjoxNzAyOTE0ODgyLCJpc3MiOiJ2dHRlY2hzb2x1dGlvbiIsImF1ZCI6InZ0dGVjaHNvbHV0aW9uIn0.f3ikCqc_ba8phh3Uq4SClVP0JnJJ__WImLn4isRhoUg; VTTECH_Menu_SideBarIsHide=false; .AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN', 
          'Xsrf-Token': 'CfDJ8P2UtwwrDOpPs_qllQGuX-IK0LU2rTt98Sctmui3SC3p3lmb5ftk4nYpRFDbbXzXTLpNPc42nb0_Jo3g0bbd6K3yyBUfYBXCVJ8I7K2PiKM2KCQnPLX_rYdRCUcUqIlOKQ_LkO7Go7bVykutERc-jNE'
        }
      };
      
     return axios.request(config)
      .then((response) => {
        return response.data
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      
  }
  create(createVttechDto: CreateVttechDto) {
    return 'This action adds a new vttech';
  }

  findAll() {
    return `This action returns all vttech`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vttech`;
  }

  update(id: number, updateVttechDto: UpdateVttechDto) {
    return `This action updates a #${id} vttech`;
  }

  remove(id: number) {
    return `This action removes a #${id} vttech`;
  }
}
