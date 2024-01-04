import { Component } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  notifications: any[] = [];
  ngOnInit() {
    // const eventSource = new EventSource(environment.APIURL+'/notifications');
    // const notificationStream = fromEvent(eventSource, 'message');

    // notificationStream
    //   .pipe(map((event: any) => JSON.parse(event.data)))
    //   .subscribe((notification: any) => {
    //     this.notifications.push(notification);
    //   });
  }
}
