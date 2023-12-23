import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import axios from 'axios';
@Controller('vttech')
export class VttechController {
  constructor(private readonly vttechService: VttechService) { }

  @Post()
  create(@Body() createVttechDto: CreateVttechDto) {
    return this.vttechService.create(createVttechDto);
  }
  @Get('getallkh/:idCN')
  GetAllKhachhang(@Param('idCN') idCN: string) {
    return this.vttechService.GetAllKhachhang(idCN);
  }
  @Get('findSDT/:SDT')
  GetKHBySDT(@Param('SDT') SDT: string) {
    return this.vttechService.GetKHBySDT(SDT);
  }
  @Get('dichvu/:CUSID')
  GetDichVu(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetDichVu(CUSID);
  }
  @Get('lichhen/:CUSID')
  GetLichhen(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetDichVu(CUSID);
  }

  @Get('vttech_khachhang')
  vttech_khachhang() {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://tmtaza.vttechsolution.com/Customer/ListCustomer/?handler=LoadData&date=01-12-2023+to+31-12-2023&branchID=7&maxdate=365',
      headers: {
        'Cookie': '.AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN; _ga=GA1.1.1456326643.1691977621; _fbp=fb.1.1691977621911.703803527; _gcl_au=1.1.210932540.1700097971; _ga_P3LS0098CH=GS1.1.1703146625.30.0.1703147055.0.0.0; .AspNetCore.Antiforgery.yCr0Ige0lxA=CfDJ8P2UtwwrDOpPs_qllQGuX-ILzwcrJ_UT7ZQ0hAmRHxX7l4AgsaHL05549_uuPT3O_X0M-vAPXT85Crq49f3vclE8yy7hMJmIJDLXqGmIDLSpDUTw7THcijL77uPOjXt6zol57B2034iqx_SKgLQACTA; .AspNetCore.Session=CfDJ8P2UtwwrDOpPs%2FqllQGuX%2BLOx5EZ2AwQC5QHSV1sLj0HNS535X0CBeauW82aCn2LzM%2Bugg0eWYJ26Iw4t1T3BNXxs8JZWKg5yRi33dtb67jCeIOwJ3%2BxS7AvPWukoGHlh8As9q4GhRiMY2TKa071%2BVi2WaoXV9Pj2aaZ67ZbBOHI; VTTECH_Menu_SideBarIsHide=false; WebToken=eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2hpa2lldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IndlYmFwcCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiMjAzMTllN2UtNWI2MS00NTdlLWJlYzctN2U4MzcyNDVmOTkzIiwiZXhwIjoxNzAzMjg0NTc5LCJpc3MiOiJ2dHRlY2hzb2x1dGlvbiIsImF1ZCI6InZ0dGVjaHNvbHV0aW9uIn0.7oM4ozw4urPuCmRnwFckifAHZakV_2EPfZehzbq39j4; .AspNetCore.Culture=c%3Dvi-VN%7Cuic%3Dvi-VN',
        'Xsrf-Token': 'CfDJ8P2UtwwrDOpPs_qllQGuX-JWsRDbvXm3Ukk5B3cHxt1LB0qsacudRVG-5EtNx3fgcyG0fP4NJtkZ8AcwdhKskgSgHNiBE_nj8qgqfkwpAJdr6oUdlZuHm83CjmkfLewDoXJ-AikOsIN3zFe6iUXfMkg'
      }
    };

    axios.request(config)
      .then((response) => {
        
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  }

  @Get()
  findAll() {
    return this.vttechService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vttechService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechDto: UpdateVttechDto) {
    return this.vttechService.update(+id, updateVttechDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechService.remove(+id);
  }
}
