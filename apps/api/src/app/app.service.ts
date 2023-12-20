import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  private notificationSource = new Subject<any>();
  notification$ = this.notificationSource.asObservable();

  triggerNotification(notification: any) {
    this.notificationSource.next(notification);
  }

  getNotificationStream() {
    return this.notification$;
  }
}
