import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DanhgiaService {
  private _danhgias: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _danhgia: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get danhgias$(): Observable<any[] | null> {
    return this._danhgias.asObservable();
  }
  get danhgia$(): Observable<any | null> {
    return this._danhgia.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllDanhgias() {
    return this.http.get(environment.APIURL + '/danhgia').pipe(
      map((data: any) => { 
        this._danhgias.next(data);
        return data;
      })
    );
  }
  searchDanhgia(query:any) {
    return this.http.get(environment.APIURL + `/danhgia/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getDanhgiaBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/danhgia/findslug/${slug}`).pipe(
      map((data: any) => {
        this._danhgia.next(data);
        return data;
      })
    );
  }
  getPaginaDanhgias(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/danhgia/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getDanhgiaById(id: string) {
    return this.http.get(environment.APIURL + `/danhgia/findid/${id}`).pipe(
      map((data: any) => {
        this._danhgia.next(data);
        return data;
      })
    );
  }
  CreateDanhgia(data: any) {
    return this.danhgias$.pipe(
      take(1),
      switchMap((danhgias: any) =>
        this.http.post(environment.APIURL + '/danhgia', data).pipe(
          map((danhgia) => {
            if (danhgias?.length > 0) {
              this._danhgias.next([...danhgias, danhgia]);
            }
            return danhgia;
          })
        )
      )
    );
  }
  UpdateDanhgia(data: any) {
    return this.danhgias$.pipe(
      take(1),
      switchMap((danhgias: any) =>
        this.http.patch(environment.APIURL + `/danhgia/${data.id}`, data).pipe(
          map((danhgia) => {
            const index = danhgias.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              danhgias[index] = data;
              this._danhgias.next(danhgias as any[]);
            } else {
              this._danhgias.next([danhgia]);

            }
            return danhgia;
          })
        )
      )
    );
  }
  DeleteDanhgia(id: string) {
    return this.danhgias$.pipe(
      take(1),
      switchMap((danhgias: any) =>
        this.http.delete(environment.APIURL + `/danhgia/${id}`).pipe(
          map((isDelete) => {
            const updateDanhgia = danhgias.filter((e: any) => e.id != id);
            this._danhgias.next(updateDanhgia);
            return isDelete;
          })
        )
      )
    );
  }
}
