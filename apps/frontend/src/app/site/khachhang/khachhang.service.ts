import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KhachhangService {
  private urlApi = environment.APIURL;
  private _khachhangs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _khachhang: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get khachhangs$(): Observable<any[] | null> {
    return this._khachhangs.asObservable();
  }
  get khachhang$(): Observable<any | null> {
    return this._khachhang.asObservable();
  }
  constructor(private http: HttpClient) { }
  getKhachhangs() {
    return this.http.get(this.urlApi + '/khachhang').pipe(
      map((data: any) => { 
        this._khachhangs.next(data);
        return data;
      })
    );
  }
  searchKhachhang(query:any) {
    return this.http.get(this.urlApi + `/khachhang/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getKhachhangBySlug(slug: string) {
    return this.http.get(this.urlApi + `/khachhang/findslug/${slug}`).pipe(
      map((data: any) => {
        this._khachhang.next(data);
        return data;
      })
    );
  }
  getPaginaKhachhangs(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(this.urlApi+'/khachhang/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getKhachhangById(id: string) {
    return this.http.get(this.urlApi + `/khachhang/findid/${id}`).pipe(
      map((data: any) => {
        this._khachhang.next(data);
        return data;
      })
    );
  }
  postKhachhang(data: any) {
    return this.khachhangs$.pipe(
      take(1),
      switchMap((khachhangs: any) =>
        this.http.post(this.urlApi + '/khachhang', data).pipe(
          map((khachhang) => {
            if (khachhangs?.length > 0) {
              this._khachhangs.next([...khachhangs, khachhang]);
            }
            return khachhang;
          })
        )
      )
    );
  }
  updateKhachhang(data: any) {
    return this.khachhangs$.pipe(
      take(1),
      switchMap((khachhangs: any) =>
        this.http.patch(this.urlApi + `/khachhang/${data.id}`, data).pipe(
          map((khachhang) => {
            const index = khachhangs.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              khachhangs[index] = data;
              this._khachhangs.next(khachhangs as any[]);
            } else {
              this._khachhangs.next([khachhang]);

            }
            return khachhang;
          })
        )
      )
    );
  }
  deleteKhachhang(id: string) {
    return this.khachhangs$.pipe(
      take(1),
      switchMap((khachhangs: any) =>
        this.http.delete(this.urlApi + `/khachhang/${id}`).pipe(
          map((isDelete) => {
            const updateKhachhang = khachhangs.filter((e: any) => e.id != id);
            this._khachhangs.next(updateKhachhang);
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
