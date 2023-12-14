import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DanhmucService {
  private _danhmucs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _danhmuc: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get danhmucs$(): Observable<any[] | null> {
    return this._danhmucs.asObservable();
  }
  get danhmuc$(): Observable<any | null> {
    return this._danhmuc.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllDanhmucs() {
    return this.http.get(environment.APIURL + '/danhmuc').pipe(
      map((data: any) => { 
        this._danhmucs.next(data);
        return data;
      })
    );
  }
  searchDanhmuc(query:any) {
    return this.http.get(environment.APIURL + `/danhmuc/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getDanhmucBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/danhmuc/findslug/${slug}`).pipe(
      map((data: any) => {
        this._danhmuc.next(data);
        return data;
      })
    );
  }
  getPaginaDanhmucs(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/danhmuc/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getDanhmucById(id: string) {
    return this.http.get(environment.APIURL + `/danhmuc/findid/${id}`).pipe(
      map((data: any) => {
        this._danhmuc.next(data);
        return data;
      })
    );
  }
  CreateDanhmuc(data: any) {
    return this.danhmucs$.pipe(
      take(1),
      switchMap((danhmucs: any) =>
        this.http.post(environment.APIURL + '/danhmuc', data).pipe(
          map((danhmuc) => {
            if (danhmucs?.length > 0) {
              this._danhmucs.next([...danhmucs, danhmuc]);
            }
            return danhmuc;
          })
        )
      )
    );
  }
  UpdateDanhmuc(data: any) {
    return this.danhmucs$.pipe(
      take(1),
      switchMap((danhmucs: any) =>
        this.http.patch(environment.APIURL + `/danhmuc/${data.id}`, data).pipe(
          map((danhmuc) => {
            const index = danhmucs.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              danhmucs[index] = data;
              this._danhmucs.next(danhmucs as any[]);
            } else {
              this._danhmucs.next([danhmuc]);

            }
            return danhmuc;
          })
        )
      )
    );
  }
  DeleteDanhmuc(id: string) {
    return this.danhmucs$.pipe(
      take(1),
      switchMap((danhmucs: any) =>
        this.http.delete(environment.APIURL + `/danhmuc/${id}`).pipe(
          map((isDelete) => {
            const updateDanhmuc = danhmucs.filter((e: any) => e.id != id);
            this._danhmucs.next(updateDanhmuc);
            return isDelete;
          })
        )
      )
    );
  }
}
