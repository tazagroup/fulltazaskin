import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KhachhangdanhgiaService {
  private _khachhangdanhgias: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _khachhangdanhgia: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get khachhangdanhgias$(): Observable<any[] | null> {
    return this._khachhangdanhgias.asObservable();
  }
  get khachhangdanhgia$(): Observable<any | null> {
    return this._khachhangdanhgia.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllKhachhangdanhgias() {
    return this.http.get(environment.APIURL + '/khachhangdanhgia').pipe(
      map((data: any) => { 
        this._khachhangdanhgias.next(data);
        return data;
      })
    );
  }
  searchKhachhangdanhgia(query:any) {
    return this.http.get(environment.APIURL + `/khachhangdanhgia/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getKhachhangdanhgiaBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/khachhangdanhgia/findslug/${slug}`).pipe(
      map((data: any) => {
        this._khachhangdanhgia.next(data);
        return data;
      })
    );
  }
  getPaginaKhachhangdanhgias(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/khachhangdanhgia/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getKhachhangdanhgiaById(id: string) {
    return this.http.get(environment.APIURL + `/khachhangdanhgia/findid/${id}`).pipe(
      map((data: any) => {
        this._khachhangdanhgia.next(data);
        return data;
      })
    );
  }
  CreateKhachhangdanhgia(data: any) {
    return this.khachhangdanhgias$.pipe(
      take(1),
      switchMap((khachhangdanhgias: any) =>
        this.http.post(environment.APIURL + '/khachhangdanhgia', data).pipe(
          map((khachhangdanhgia) => {
            if (khachhangdanhgias?.length > 0) {
              this._khachhangdanhgias.next([...khachhangdanhgias, khachhangdanhgia]);
            }
            return khachhangdanhgia;
          })
        )
      )
    );
  }
  UpdateKhachhangdanhgia(data: any) {
    return this.khachhangdanhgias$.pipe(
      take(1),
      switchMap((khachhangdanhgias: any) =>
        this.http.patch(environment.APIURL + `/khachhangdanhgia/${data.id}`, data).pipe(
          map((khachhangdanhgia) => {
            const index = khachhangdanhgias.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              khachhangdanhgias[index] = data;
              this._khachhangdanhgias.next(khachhangdanhgias as any[]);
            } else {
              this._khachhangdanhgias.next([khachhangdanhgia]);

            }
            return khachhangdanhgia;
          })
        )
      )
    );
  }
  DeleteKhachhangdanhgia(id: string) {
    return this.khachhangdanhgias$.pipe(
      take(1),
      switchMap((khachhangdanhgias: any) =>
        this.http.delete(environment.APIURL + `/khachhangdanhgia/${id}`).pipe(
          map((isDelete) => {
            const updateKhachhangdanhgia = khachhangdanhgias.filter((e: any) => e.id != id);
            this._khachhangdanhgias.next(updateKhachhangdanhgia);
            return isDelete;
          })
        )
      )
    );
  }
}
