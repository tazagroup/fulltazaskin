import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { TelegramService } from '../shared/telegram.service';
import { Vttech_khachhangService } from './vttech_khachhang/vttech_khachhang.service';
import { ApiTags } from '@nestjs/swagger';
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
  @ApiTags('Vttech')
  @Post('getToken')
  getToken(@Body() data: any) {
    return this.vttechService.getToken(data);
  }
  @Post()
  create(@Body() createVttechDto: CreateVttechDto) {
    return this.vttechService.create(createVttechDto);
  }
  @ApiTags('Vttech')
  @Get('vttech_khachhang')
  async GetAllKhachhang(@Body() data: any) {
    return await this.vttechService.getAllKhachhang(data);
  }
  @ApiTags('Vttech')
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
  @ApiTags('Vttech')
  @Get('findSDT/:SDT')
  GetKHBySDT(@Param('SDT') SDT: string) {
    return this.vttechService.GetKHBySDT(SDT);
  }
  @ApiTags('Vttech')
  @Get('dichvu/:SDT')
  GetDichVu(@Param('SDT') SDT: string) {
    return this.vttechService.GetDichVu(SDT);
  }
  @ApiTags('Vttech')
  @Get('lieutrinh/:SDT')
  async GetLieutrinh(@Param('SDT') SDT: string) {
    console.log('Lieu trinh',SDT);
    const result = await this.vttechService.GetLieutrinh(SDT);
    console.log(result);

    return result
  }
  @ApiTags('Vttech')
  @Get('dichvus')
  GetDichVus() {
    return this.vttechService.GetDichVus();
  }
  @ApiTags('Vttech')
  @Post('thanhtoan/:SDT')
  async GetThanhtoan(@Param('SDT') SDT: string) {
    console.log('Thanh toan',SDT);
    const result = await this.vttechService.GetThanhtoan(SDT);
    console.log(result);
    return result
  }
  @ApiTags('Vttech')
  @Get('payment/:SDT')
  GetPaymentInfo(@Param('SDT') SDT: string) {
    return this.vttechService.GetPaymentInfo(SDT);
  }
  @ApiTags('Vttech')
  @Get('hangthanhvien/:SDT')
  GetHangthanhvien(@Param('SDT') SDT: string) {
    return this.vttechService.GetHangthanhvien(SDT);
  }
  @ApiTags('Vttech')
  @Get('lichhen/:SDT')
  GetLichhen(@Param('SDT') SDT: string) {
    return this.vttechService.GetLichhen(SDT);
  }
  @ApiTags('Vttech')
  @Get()
  findAll() {
    return this.vttechService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vttechService.findOne(+id);
  // }
  @ApiTags('Vttech')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVttechDto: UpdateVttechDto) {
    return this.vttechService.update(+id, updateVttechDto);
  }
  @ApiTags('Vttech')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vttechService.remove(+id);
  }
  Getdatetime(data: any) {
    const date1 = new Date(data);
    return date1.getTime()
  }
}
