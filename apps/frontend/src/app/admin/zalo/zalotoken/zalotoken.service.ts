import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ZalotokenService {
  private _zalotokens: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _zalotoken: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get zalotokens$(): Observable<any[] | null> {
    return this._zalotokens.asObservable();
  }
  get zalotoken$(): Observable<any | null> {
    return this._zalotoken.asObservable();
  }
  constructor(private http: HttpClient) { }
  get_accesstoken(data: any) {
    return  this.http.post(environment.APIURL + '/zalotoken/get_accesstoken', data).pipe(
          map((zalotoken) => {
          return zalotoken
          })
        )
  }
  get_refreshToken(data: any) {
    return  this.http.post(environment.APIURL + '/zalotoken/get_refreshtoken', data).pipe(
          map((zalotoken) => {
          return zalotoken
          })
        )
  }
  getAllZalotokens() {
    return this.http.get(environment.APIURL + '/zalotoken').pipe(
      map((data: any) => { 
        this._zalotokens.next(data);
        return data;
      })
    );
  }
  searchZalotoken(query:any) {
    return this.http.get(environment.APIURL + `/zalotoken/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getZalotokenBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/zalotoken/findslug/${slug}`).pipe(
      map((data: any) => {
        this._zalotoken.next(data);
        return data;
      })
    );
  }
  getPaginaZalotokens(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/zalotoken/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getZalotokenById(id: string) {
    return this.http.get(environment.APIURL + `/zalotoken/findid/${id}`).pipe(
      map((data: any) => {
        this._zalotoken.next(data);
        return data;
      })
    );
  }
  CreateZalotoken(data: any) {
    return this.zalotokens$.pipe(
      take(1),
      switchMap((zalotokens: any) =>
        this.http.post(environment.APIURL + '/zalotoken', data).pipe(
          map((zalotoken) => {
            if (zalotokens?.length > 0) {
              this._zalotokens.next([...zalotokens, zalotoken]);
            }
            return zalotoken;
          })
        )
      )
    );
  }
  UpdateZalotoken(data: any) {
    return this.zalotokens$.pipe(
      take(1),
      switchMap((zalotokens: any) =>
        this.http.patch(environment.APIURL + `/zalotoken/${data.id}`, data).pipe(
          map((zalotoken) => {
            const index = zalotokens.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              zalotokens[index] = data;
              this._zalotokens.next(zalotokens as any[]);
            } else {
              this._zalotokens.next([zalotoken]);
            }
            return zalotoken;
          })
        )
      )
    );
  }
  DeleteZalotoken(id: string) {
    return this.zalotokens$.pipe(
      take(1),
      switchMap((zalotokens: any) =>
        this.http.delete(environment.APIURL + `/zalotoken/${id}`).pipe(
          map((isDelete) => {
            const updateZalotoken = zalotokens.filter((e: any) => e.id != id);
            this._zalotokens.next(updateZalotoken);
            return isDelete;
          })
        )
      )
    );
  }
}
