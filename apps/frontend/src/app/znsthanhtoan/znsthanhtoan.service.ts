import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ZnsthanhtoanService {
  private _znsthanhtoans: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _thanhtoans: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _znsthanhtoan: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get thanhtoans$(): Observable<any[] | null> {
    return this._thanhtoans.asObservable();
  }
  get znsthanhtoans$(): Observable<any[] | null> {
    return this._znsthanhtoans.asObservable();
  }
  get znsthanhtoan$(): Observable<any | null> {
    return this._znsthanhtoan.asObservable();
  }
  constructor(private http: HttpClient) { }
  getAllZnsthanhtoans() {
    return this.http.get(environment.APIURL + '/znsthanhtoan').pipe(
      map((data: any) => { 
        this._znsthanhtoans.next(data);
        return data;
      })
    );
  }
  searchZnsthanhtoan(SearchParams:any) {
    return this.http.post(environment.APIURL + `/znsthanhtoan/search`,SearchParams).pipe(
      map((data: any) => { 
        this._znsthanhtoans.next(data);
        return data;
      })
    );
  }
  searchOld(SearchParams:any) {
    return this.http.post(environment.APIURL + `/znsthanhtoan/search`,SearchParams).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getZnsthanhtoanBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/znsthanhtoan/findslug/${slug}`).pipe(
      map((data: any) => {
        this._znsthanhtoan.next(data);
        return data;
      })
    );
  }
  getPaginaZnsthanhtoans(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/znsthanhtoan/pagination',{ params }).pipe(
      map((data: any) => {
        this._znsthanhtoans.next(data);
        return data;
      })
    );
  }
  getZnsthanhtoanById(id: string) {
    return this.http.get(environment.APIURL + `/znsthanhtoan/findid/${id}`).pipe(
      map((data: any) => {
        this._znsthanhtoan.next(data);
        return data;
      })
    );
  }
  SendZns(data: any) {
    return this.http.post(environment.APIURL + '/znsthanhtoan/sendzns', data).pipe(
          map((result) => {
            console.log(result); 
            return result;
          })
        )
  }
  CreateZnsthanhtoan(data: any) {
    return this.znsthanhtoans$.pipe(
      take(1),
      switchMap((znsthanhtoans: any) =>
        this.http.post(environment.APIURL + '/znsthanhtoan', data).pipe(
          map((znsthanhtoan) => {
            if (znsthanhtoans?.length > 0) {
              this._znsthanhtoans.next([...znsthanhtoans, znsthanhtoan]);
            }
            return znsthanhtoan;
          })
        )
      )
    );
  }
  UpdateZnsthanhtoan(data: any) {
    return this.znsthanhtoans$.pipe(
      take(1),
      switchMap((znsthanhtoans: any) =>
        this.http.patch(environment.APIURL + `/znsthanhtoan/${data.id}`, data).pipe(
          map((znsthanhtoan) => {
            const index = znsthanhtoans.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              znsthanhtoans[index] = data;
              this._znsthanhtoans.next(znsthanhtoans as any[]);
            } else {
              this._znsthanhtoans.next([znsthanhtoan]);

            }
            return znsthanhtoan;
          })
        )
      )
    );
  }
  DeleteZnsthanhtoan(id: string) {
    return this.znsthanhtoans$.pipe(
      take(1),
      switchMap((znsthanhtoans: any) =>
        this.http.delete(environment.APIURL + `/znsthanhtoan/${id}`).pipe(
          map((isDelete) => {
            const updateZnsthanhtoan = znsthanhtoans.filter((e: any) => e.id != id);
            this._znsthanhtoans.next(updateZnsthanhtoan);
            return isDelete;
          })
        )
      )
    );
  }
}
