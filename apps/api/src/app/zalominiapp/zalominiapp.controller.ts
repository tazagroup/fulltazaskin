import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZalominiappService } from './zalominiapp.service';
import { CreateZalominiappDto } from './dto/create-zalominiapp.dto';
import { UpdateZalominiappDto } from './dto/update-zalominiapp.dto';
import axios from 'axios';
import { CauhinhchungService } from '../cauhinh/cauhinhchung/cauhinhchung.service';
@Controller('zalominiapp')
export class ZalominiappController {
  Cookie: any = ''
  XsrfToken: any = ''
  constructor(
    private readonly zalominiappService: ZalominiappService,
    private _CauhinhchungService: CauhinhchungService,
  ) {
      this._CauhinhchungService.findslug('vttechtoken').then((data: any) => {
      this.Cookie = data.Content.Cookie
      this.XsrfToken = data.Content.XsrfToken
    })
  }

  @Post()
  create(@Body() createZalominiappDto: CreateZalominiappDto) {
    return this.zalominiappService.create(createZalominiappDto);
  }

 @Get()
  findAll() {
    return this.zalominiappService.findAll();
  }
  @Get('findsdt/:sdt')
  async findsdt(@Param('sdt') sdt: string) {
    console.log('token',this.XsrfToken);
    console.log('Cookie',this.Cookie);
    console.log('SDT',sdt);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://tmtaza.vttechsolution.com/Searching/Searching/?handler=SearchByOption&data=%5B%7B%22name%22%3A%22PHONENUMBER%22%2C%22value%22%3A%22${sdt}%22%7D%5D&CBeginID=0`,
      headers: { Cookie: this.Cookie, 'Xsrf-Token': this.XsrfToken },
    };
    return axios.request(config)
    .then((response: any) => {
      console.log(response);

      return response
    })
    .catch((error: any) => {
      console.log(error);
    });
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zalominiappService.findOne(+id);
  }
  @Get('getinfo/:sdt')
  getInfo(@Param('sdt') sdt: string) {
    console.log(sdt);

    return this.zalominiappService.findAll();
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZalominiappDto: UpdateZalominiappDto) {
    return this.zalominiappService.update(+id, updateZalominiappDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zalominiappService.remove(+id);
  }
}
