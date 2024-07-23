import { Controller, Get, Req, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response,Request } from 'express';
import { LazyModuleLoader } from '@nestjs/core';
import { ZalominiappModule } from './zalominiapp/zalominiapp.module';
import { ZalominiappService } from './zalominiapp/zalominiapp.service';
export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}
@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly lazyModuleLoader: LazyModuleLoader
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('getcookies')
  getCookie(@Req() req: Request) {
    console.log(req);
    const cookie = req.cookies['.AspNetCore.Session'];
    return cookie ? `Cookie: ${cookie}` : 'No cookie found';
  }
  @Get('getversion')
  getversion() {
    return '1.7'
  }
  @Get('zalominiapp/getall')
  async getLazyReport() {
    const moduleRef = await this.lazyModuleLoader.load(() => ZalominiappModule);
    const reportsService = moduleRef.get(ZalominiappService);
    return reportsService.findAll();
  }
  // @Sse('notifications')
  // @Get('/notifications')
  // handleNotifications(res:any) {
  //   const observable = this.appService.getNotificationStream().pipe(
  //     map((notification) => ({ data: JSON.stringify(notification) }))
  //   );

  //   return observable;
  // }

}

