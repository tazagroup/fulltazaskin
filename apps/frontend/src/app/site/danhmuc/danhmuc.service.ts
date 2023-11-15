import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DanhmucService {
  private urlApi = environment.APIURL;
  private _danhmucs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _danhmuc: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get danhmucs$(): Observable<any[] | null> {
    return this._danhmucs.asObservable();
  }
  get danhmuc$(): Observable<any | null> {
    return this._danhmuc.asObservable();
  }
  constructor(private http: HttpClient) { }
  getDanhmucs() {
    return this.http.get(this.urlApi + '/danhmuc').pipe(
      map((data: any) => { 
        this._danhmucs.next(data);
        return data;
      })
    );
  }
  searchDanhmuc(query:any) {
    return this.http.get(this.urlApi + `/danhmuc/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getDanhmucBySlug(slug: string) {
    return this.http.get(this.urlApi + `/danhmuc/findslug/${slug}`).pipe(
      map((data: any) => {
        this._danhmuc.next(data);
        return data;
      })
    );
  }
  getPaginaDanhmucs(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(this.urlApi+'/danhmuc/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getDanhmucById(id: string) {
    return this.http.get(this.urlApi + `/danhmuc/findid/${id}`).pipe(
      map((data: any) => {
        this._danhmuc.next(data);
        return data;
      })
    );
  }
  postDanhmuc(data: any) {
    return this.danhmucs$.pipe(
      take(1),
      switchMap((danhmucs: any) =>
        this.http.post(this.urlApi + '/danhmuc', data).pipe(
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
  updateDanhmuc(data: any) {
    return this.danhmucs$.pipe(
      take(1),
      switchMap((danhmucs: any) =>
        this.http.patch(this.urlApi + `/danhmuc/${data.id}`, data).pipe(
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
  deleteDanhmuc(id: string) {
    return this.danhmucs$.pipe(
      take(1),
      switchMap((danhmucs: any) =>
        this.http.delete(this.urlApi + `/danhmuc/${id}`).pipe(
          map((isDelete) => {
            const updateDanhmuc = danhmucs.filter((e: any) => e.id != id);
            this._danhmucs.next(updateDanhmuc);
            return isDelete;
          })
        )
      )
    );
  }
  DeleteuploadDriver(data: any): Observable<any> {
    console.log(data);
    return this.http.delete(this.urlApi + `/upload/${data.id}`,{ body: data }).pipe(
      map((res: any) => {
        if (res) {
          console.log(res);
          return res;
        }
      })
    );
  }
  uploadDriver(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `day_month_year`;
    return this.http.post(this.urlApi + `/upload/server?folder=hderma/${formattedDate}`, formData).pipe(
      map((data: any) => {
        if (data) {
          return data;
        }
      })
    );
  }
}
