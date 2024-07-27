import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VttechService } from './vttech.service';
import { CreateVttechDto } from './dto/create-vttech.dto';
import { UpdateVttechDto } from './dto/update-vttech.dto';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('vttech')
export class VttechController {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    private readonly vttechService: VttechService,
    private _CauhinhchungService: CauhinhchungService,
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
  @Get()
  findAll() {
    return this.vttechService.findAll();
  }

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
