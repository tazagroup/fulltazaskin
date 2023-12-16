import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res } from '@nestjs/common';
import { ZaloService } from './zalo.service';
import { CreateZaloDto } from './create-zalo.dto';
import { UpdateZaloDto } from './update-zalo.dto';

@Controller('zalo')
export class ZaloController {
  constructor(
    private readonly zaloService: ZaloService,
    ) {}
  @Post('/me')
  async getMeInfo(@Body() data: any): Promise<any> {
    //console.error(data);
    const userAccessToken = data.userAccessToken;
    const token = data.token;
    const meInfo = await this.zaloService.getMeInfo(userAccessToken, token);
    return meInfo;
  }
  @Post()
  create(@Body() createZaloDto: CreateZaloDto) {
    return this.zaloService.create(createZaloDto);
  }

  @Get()
  findAll() {
    return this.zaloService.findAll();
  }
  @Get('search')
  searchBooks(@Query('query') query: string) {
    return this.zaloService.searchzalo(query);
  }
  @Get('pagina')
  findPagina(@Query('page') page: number, @Query('limit') limit: number) {
    //console.error();
    return this.zaloService.findPagina(page,limit);
  }
  @Get('findslug/:slug')
  findslug(@Param('slug') slug: string) {
    return this.zaloService.findslug(slug);
  }
  @Get('findid/:id')
  findid(@Param('id') id: any) {    
    return this.zaloService.findid(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZaloDto: UpdateZaloDto) {
    return this.zaloService.update(id, updateZaloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zaloService.remove(id);
  }
}
