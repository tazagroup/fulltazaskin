import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _notificationss: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _notifications: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get notificationss$(): Observable<any[] | null> {
    return this._notificationss.asObservable();
  }
  get notifications$(): Observable<any | null> {
    return this._notifications.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllNotificationss() {
    return this.http.get(environment.APIURL + '/notifications').pipe(
      map((data: any) => { 
        this._notificationss.next(data);
        return data;
      })
    );
  }
  searchNotifications(query:any) {
    return this.http.get(environment.APIURL + `/notifications/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getNotificationsBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/notifications/findslug/${slug}`).pipe(
      map((data: any) => {
        this._notifications.next(data);
        return data;
      })
    );
  }
  getPaginaNotificationss(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/notifications/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getNotificationsById(id: string) {
    return this.http.get(environment.APIURL + `/notifications/findid/${id}`).pipe(
      map((data: any) => {
        this._notifications.next(data);
        return data;
      })
    );
  }
  CreateNotifications(data: any) {
    return this.notificationss$.pipe(
      take(1),
      switchMap((notificationss: any) =>
        this.http.post(environment.APIURL + '/notifications', data).pipe(
          map((notifications) => {
            if (notificationss?.length > 0) {
              this._notificationss.next([...notificationss, notifications]);
            }
            return notifications;
          })
        )
      )
    );
  }
  UpdateNotifications(data: any) {
    return this.notificationss$.pipe(
      take(1),
      switchMap((notificationss: any) =>
        this.http.patch(environment.APIURL + `/notifications/${data.id}`, data).pipe(
          map((notifications) => {
            const index = notificationss.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              notificationss[index] = data;
              this._notificationss.next(notificationss as any[]);
            } else {
              this._notificationss.next([notifications]);

            }
            return notifications;
          })
        )
      )
    );
  }
  DeleteNotifications(id: string) {
    return this.notificationss$.pipe(
      take(1),
      switchMap((notificationss: any) =>
        this.http.delete(environment.APIURL + `/notifications/${id}`).pipe(
          map((isDelete) => {
            const updateNotifications = notificationss.filter((e: any) => e.id != id);
            this._notificationss.next(updateNotifications);
            return isDelete;
          })
        )
      )
    );
  }
}
