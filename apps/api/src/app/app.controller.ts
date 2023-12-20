import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
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
  @Sse('notifications')
  @Get('/notifications')
  handleNotifications(res:any) {
    const observable = this.appService.getNotificationStream().pipe(
      map((notification) => ({ data: JSON.stringify(notification) }))
    );

    return observable;
  }

}

