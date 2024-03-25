import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { TelegramService } from '../shared/telegram.service';
import { Vttech_khachhangService } from './vttech_khachhang/vttech_khachhang.service';
import { Interval } from '@nestjs/schedule';
@Controller('vttech')
export class VttechController {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    private readonly vttechService: VttechService,
    private _CauhinhchungService: CauhinhchungService,
    private _TelegramService: TelegramService,
    private _Vttech_khachhangService: Vttech_khachhangService,
    )  {
      this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
        this.Cookie = data.Content.Cookie
        this.XsrfToken = data.Content.XsrfToken
      })
    }

  @Post()
  create(@Body() createVttechDto: CreateVttechDto) {
    return this.vttechService.create(createVttechDto);
  }
  @Get('vttech_khachhang')
  async GetAllKhachhang(@Body() data: any) {
    return await this.vttechService.getAllKhachhang(data);
  }
  @Get('vttech_tinhtrangphong')
  async getTinhtrangphong() {
    return await this.vttechService.getTinhtrangphong();
  }
  // @Get('vttech_dieutri')
  // async getDieutri(@Body() data: any) {
  //   return await this.vttechService.getDieutri(data);
  // }
  // @Interval(3600000)
  // @Get('vttech_createdieutri')
  // async CreateDieutri() {
  //   return await this.vttechService.CreateDieutri();
  // }
  // @Interval(4000000)
  // @Get('vttech_createznsdieutri')
  // async CreateZNSDieutri() {
  //   return await this.vttechService.CreateZNSDieutri();
  // }
  // @Interval(4200000)
  // @Get('vttech_znsdieutri')
  // async AddCronZNSDieutri() {
  //   return await this.vttechService.AddCronZNSDieutri();
  // }
  // @Post('vttech_sendznsdieutri')
  // async SendZnsDieutri(@Body() data: any) {
  //   return await this.vttechService.SendZnsDieutri(data);
  // }
  @Get('findSDT/:SDT')
  GetKHBySDT(@Param('SDT') SDT: string) {
    return this.vttechService.GetKHBySDT(SDT);
  }
  @Get('dichvu/:CUSID')
  GetDichVu(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetDichVu(CUSID);
  }
  @Post('dichvus')
  GetDichVus(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetDichVus(CUSID);
  }
  @Post('thanhtoan/:CUSID')
  GetThanhtoan(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetThanhtoan(CUSID);
  }
  @Get('payment/:SDT')
  GetPaymentInfo(@Param('SDT') SDT: string) {
    return this.vttechService.GetPaymentInfo(SDT);
  }
  @Get('lichhen/:CUSID')
  GetLichhen(@Param('CUSID') CUSID: string) {
    return this.vttechService.GetLichhen(CUSID);
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
  Getdatetime(data: any) {
    const date1 = new Date(data);
    return date1.getTime()
  }
}
