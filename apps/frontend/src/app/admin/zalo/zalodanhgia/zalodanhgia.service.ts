import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ZalodanhgiaService {
  private _zalodanhgias: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _zalodanhgia: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get zalodanhgias$(): Observable<any[] | null> {
    return this._zalodanhgias.asObservable();
  }
  get zalodanhgia$(): Observable<any | null> {
    return this._zalodanhgia.asObservable();
  }
  constructor(private http: HttpClient) { }

  GetFromZalo(data:any) {    
    return this.http.post(environment.APIURL + '/zalodanhgia/getdanhgia',data).pipe(
      map((data: any) => { 
           return data
      })
    );
  }
  getAllZalodanhgias() {
    return this.http.get(environment.APIURL + '/zalodanhgia').pipe(
      map((data: any) => { 
        this._zalodanhgias.next(data);
        return data;
      })
    );
  }
  searchVttechthanhtoan(SearchParams:any) {
    return this.http.post(environment.APIURL + `/zalodanhgia/search`,SearchParams).pipe(
      map((data: any) => { 
        this._zalodanhgias.next(data);
        return data;
      })
    );
  }
  getZalodanhgiaBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/zalodanhgia/findslug/${slug}`).pipe(
      map((data: any) => {
        this._zalodanhgia.next(data);
        return data;
      })
    );
  }
  getPaginaZalodanhgias(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/zalodanhgia/pagination',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getZalodanhgiaById(id: string) {
    return this.http.get(environment.APIURL + `/zalodanhgia/findid/${id}`).pipe(
      map((data: any) => {
        this._zalodanhgia.next(data);
        return data;
      })
    );
  }
  CreateZalodanhgia(data: any) {
    return this.zalodanhgias$.pipe(
      take(1),
      switchMap((zalodanhgias: any) =>
        this.http.post(environment.APIURL + '/zalodanhgia', data).pipe(
          map((zalodanhgia) => {
            if (zalodanhgias?.length > 0) {
              this._zalodanhgias.next([...zalodanhgias, zalodanhgia]);
            }
            return zalodanhgia;
          })
        )
      )
    );
  }
  UpdateZalodanhgia(data: any) {
    return this.zalodanhgias$.pipe(
      take(1),
      switchMap((zalodanhgias: any) =>
        this.http.patch(environment.APIURL + `/zalodanhgia/${data.id}`, data).pipe(
          map((zalodanhgia) => {
            const index = zalodanhgias.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              zalodanhgias[index] = data;
              this._zalodanhgias.next(zalodanhgias as any[]);
            } else {
              this._zalodanhgias.next([zalodanhgia]);

            }
            return zalodanhgia;
          })
        )
      )
    );
  }
  DeleteZalodanhgia(id: string) {
    return this.zalodanhgias$.pipe(
      take(1),
      switchMap((zalodanhgias: any) =>
        this.http.delete(environment.APIURL + `/zalodanhgia/${id}`).pipe(
          map((isDelete) => {
            const updateZalodanhgia = zalodanhgias.filter((e: any) => e.id != id);
            this._zalodanhgias.next(updateZalodanhgia);
            return isDelete;
          })
        )
      )
    );
  }
}
