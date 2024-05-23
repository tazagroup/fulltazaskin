import { Controller, Get, Req, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response,Request } from 'express';
export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}
@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService) { }

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
  
  // @Sse('notifications')
  // @Get('/notifications')
  // handleNotifications(res:any) {
  //   const observable = this.appService.getNotificationStream().pipe(
  //     map((notification) => ({ data: JSON.stringify(notification) }))
  //   );

  //   return observable;
  // }

}

