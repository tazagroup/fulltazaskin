import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ZnsdieutriService {
  private _znsdieutris: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _dieutris: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _znsdieutri: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get dieutris$(): Observable<any[] | null> {
    return this._dieutris.asObservable();
  }
  get znsdieutris$(): Observable<any[] | null> {
    return this._znsdieutris.asObservable();
  }
  get znsdieutri$(): Observable<any | null> {
    return this._znsdieutri.asObservable();
  }
  constructor(private http: HttpClient) { }
  getAllZnsdieutris() {
    return this.http.get(environment.APIURL + '/znsdieutri').pipe(
      map((data: any) => {
        this._znsdieutris.next(data);
        return data;
      })
    );
  }
  searchZnsdieutri(SearchParams:any) {
    return this.http.post(environment.APIURL + `/znsdieutri/search`,SearchParams).pipe(
      map((data: any) => {
        this._znsdieutris.next(data.items);
        return data;
      })
    );
  }
  searchOld(SearchParams:any) {
    return this.http.post(environment.APIURL + `/znsdieutri/search`,SearchParams).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getZnsdieutriBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/znsdieutri/findslug/${slug}`).pipe(
      map((data: any) => {
        this._znsdieutri.next(data);
        return data;
      })
    );
  }
  getPaginaZnsdieutris(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/znsdieutri/pagination',{ params }).pipe(
      map((data: any) => {
        this._znsdieutris.next(data);
        return data;
      })
    );
  }
  getZnsdieutriById(id: string) {
    return this.http.get(environment.APIURL + `/znsdieutri/findid/${id}`).pipe(
      map((data: any) => {
        this._znsdieutri.next(data);
        return data;
      })
    );
  }
  SendZns(data: any) {
    return this.http.post(environment.APIURL + '/znsdieutri/sendzns', data).pipe(
          map((result) => {
            console.log(result);
            return result;
          })
        )
  }
  CreateZnsdieutri(data: any) {
    return this.znsdieutris$.pipe(
      take(1),
      switchMap((znsdieutris: any) =>
        this.http.post(environment.APIURL + '/znsdieutri', data).pipe(
          map((znsdieutri) => {
            if (znsdieutris?.length > 0) {
              this._znsdieutris.next([...znsdieutris, znsdieutri]);
            }
            return znsdieutri;
          })
        )
      )
    );
  }
  UpdateZnsdieutri(data: any) {
    return this.znsdieutris$.pipe(
      take(1),
      switchMap((znsdieutris: any) =>
        this.http.patch(environment.APIURL + `/znsdieutri/${data.id}`, data).pipe(
          map((znsdieutri) => {
            const index = znsdieutris.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              znsdieutris[index] = data;
              this._znsdieutris.next(znsdieutris as any[]);
            } else {
              this._znsdieutris.next([znsdieutri]);

            }
            return znsdieutri;
          })
        )
      )
    );
  }
  DeleteZnsdieutri(id: string) {
    return this.znsdieutris$.pipe(
      take(1),
      switchMap((znsdieutris: any) =>
        this.http.delete(environment.APIURL + `/znsdieutri/${id}`).pipe(
          map((isDelete) => {
            const updateZnsdieutri = znsdieutris.filter((e: any) => e.id != id);
            this._znsdieutris.next(updateZnsdieutri);
            return isDelete;
          })
        )
      )
    );
  }
}
