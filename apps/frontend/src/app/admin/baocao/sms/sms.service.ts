import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private _smss: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _sms: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get smss$(): Observable<any[] | null> {
    return this._smss.asObservable();
  }
  get sms$(): Observable<any | null> {
    return this._sms.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllSmss() {
    return this.http.get(environment.APIURL + '/sms').pipe(
      map((data: any) => { 
        this._smss.next(data);
        return data;
      })
    );
  }
  searchSms(query:any) {
    return this.http.get(environment.APIURL + `/sms/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getSmsBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/sms/findslug/${slug}`).pipe(
      map((data: any) => {
        this._sms.next(data);
        return data;
      })
    );
  }
  getPaginaSmss(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/sms/pagination',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getSmsById(id: string) {
    return this.http.get(environment.APIURL + `/sms/findid/${id}`).pipe(
      map((data: any) => {
        this._sms.next(data);
        return data;
      })
    );
  }
  CreateSms(data: any) {
    return this.smss$.pipe(
      take(1),
      switchMap((smss: any) =>
        this.http.post(environment.APIURL + '/sms', data).pipe(
          map((sms) => {
            if (smss?.length > 0) {
              this._smss.next([...smss, sms]);
            }
            return sms;
          })
        )
      )
    );
  }
  UpdateSms(data: any) {
    return this.smss$.pipe(
      take(1),
      switchMap((smss: any) =>
        this.http.patch(environment.APIURL + `/sms/${data.id}`, data).pipe(
          map((sms) => {
            const index = smss.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              smss[index] = data;
              this._smss.next(smss as any[]);
            } else {
              this._smss.next([sms]);

            }
            return sms;
          })
        )
      )
    );
  }
  DeleteSms(id: string) {
    return this.smss$.pipe(
      take(1),
      switchMap((smss: any) =>
        this.http.delete(environment.APIURL + `/sms/${id}`).pipe(
          map((isDelete) => {
            const updateSms = smss.filter((e: any) => e.id != id);
            this._smss.next(updateSms);
            return isDelete;
          })
        )
      )
    );
  }
}
