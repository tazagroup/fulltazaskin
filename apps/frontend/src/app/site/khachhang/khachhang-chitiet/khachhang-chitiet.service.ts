import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KhachhangchitietService {
  //http://localhost:3001/khachhangchitiets/chitiet/findpaged?take=1&skip=10
  //http://localhost:3001//khachhangchitiets/chitiet
  private urlApi = environment.APIURL;
  private _khachhangchitiets: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _khachhangchitiet: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get khachhangchitiets$(): Observable<any[] | null> {
    return this._khachhangchitiets.asObservable();
  }
  get khachhangchitiet$(): Observable<any | null> {
    return this._khachhangchitiet.asObservable();
  }
  constructor(private http: HttpClient) { }
  getKhachhangchitiets() {
    return this.http.get(this.urlApi + 'khachhangs/chitiet').pipe(
      map((data: any) => { 
        this._khachhangchitiets.next(data);
        return data;
      })
    );
  }
  getLazyloadKhachhangchitiets(skip: number, take: number) {
    const params ={ skip: String(skip), take: String(take) }
    return this.http.get(this.urlApi+'khachhangs/chitiet/findpaged',{ params }).pipe(
      map((data: any) => {
        this._khachhangchitiets.next(data);
        return data;
      })
    );
  }
  searchKhachhangchitiet(query:any) {
    return this.http.get(this.urlApi + `/khachhangchitiet/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getKhachhangchitietBySlug(slug: string) {
    return this.http.get(this.urlApi + `/khachhangchitiet/findslug/${slug}`).pipe(
      map((data: any) => {
        this._khachhangchitiet.next(data);
        return data;
      })
    );
  }
  getKhachhangchitietBySDT(SDT: string) {
    return this.http.get(this.urlApi + `/khachhangs/chitiet/findsdt/${SDT}`).pipe(
      map((data: any) => {
        this._khachhangchitiet.next(data);
        return data;
      })
    );
  }
  getPaginaKhachhangchitiets(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(this.urlApi+'/khachhangchitiet/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getKhachhangchitietById(id: string) {
    return this.http.get(this.urlApi + `/khachhangchitiet/findid/${id}`).pipe(
      map((data: any) => {
        this._khachhangchitiet.next(data);
        return data;
      })
    );
  }
  postKhachhangchitiet(data: any) {
    return this.khachhangchitiets$.pipe(
      take(1),
      switchMap((khachhangchitiets: any) =>
        this.http.post(this.urlApi + '/khachhangchitiet', data).pipe(
          map((khachhangchitiet) => {
            if (khachhangchitiets?.length > 0) {
              this._khachhangchitiets.next([...khachhangchitiets, khachhangchitiet]);
            }
            return khachhangchitiet;
          })
        )
      )
    );
  }
  updateKhachhangchitiet(data: any) {
    return this.khachhangchitiets$.pipe(
      take(1),
      switchMap((khachhangchitiets: any) =>
        this.http.patch(this.urlApi + `/khachhangchitiet/${data.id}`, data).pipe(
          map((khachhangchitiet) => {
            const index = khachhangchitiets.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              khachhangchitiets[index] = data;
              this._khachhangchitiets.next(khachhangchitiets as any[]);
            } else {
              this._khachhangchitiets.next([khachhangchitiet]);

            }
            return khachhangchitiet;
          })
        )
      )
    );
  }
  deleteKhachhangchitiet(id: string) {
    return this.khachhangchitiets$.pipe(
      take(1),
      switchMap((khachhangchitiets: any) =>
        this.http.delete(this.urlApi + `/khachhangchitiet/${id}`).pipe(
          map((isDelete) => {
            const updateKhachhangchitiet = khachhangchitiets.filter((e: any) => e.id != id);
            this._khachhangchitiets.next(updateKhachhangchitiet);
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
