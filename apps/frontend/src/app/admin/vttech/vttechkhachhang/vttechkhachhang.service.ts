import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VttechkhachhangService {
  private _vttechkhachhangs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechkhachhang: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get vttechkhachhangs$(): Observable<any[] | null> {
    return this._vttechkhachhangs.asObservable();
  }
  get vttechkhachhang$(): Observable<any | null> {
    return this._vttechkhachhang.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllVttechkhachhangs() {
    return this.http.get(environment.APIURL + '/vttech_khachhang').pipe(
      map((data: any) => { 
        this._vttechkhachhangs.next(data);
        return data;
      })
    );
  }
  searchVttechkhachhangs(SearchParams:any) {
    return this.http.post(environment.APIURL + `/vttechthanhtoan/search`,SearchParams).pipe(
      map((data: any) => { 
        this._vttechkhachhangs.next(data);
        return data;
      })
    );
  }
  getVttechkhachhangBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/vttech_khachhang/findslug/${slug}`).pipe(
      map((data: any) => {
        this._vttechkhachhang.next(data);
        return data;
      })
    );
  }
  getPaginaVttechkhachhangs(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/vttech_khachhang/pagination',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getVttechkhachhangById(id: string) {
    return this.http.get(environment.APIURL + `/vttech_khachhang/findid/${id}`).pipe(
      map((data: any) => {
        this._vttechkhachhang.next(data);
        return data;
      })
    );
  }
  CreateVttechkhachhang(data: any) {
    return this.vttechkhachhangs$.pipe(
      take(1),
      switchMap((vttechkhachhangs: any) =>
        this.http.post(environment.APIURL + '/vttechkhachhang', data).pipe(
          map((vttechkhachhang) => {
            if (vttechkhachhangs?.length > 0) {
              this._vttechkhachhangs.next([...vttechkhachhangs, vttechkhachhang]);
            }
            return vttechkhachhang;
          })
        )
      )
    );
  }
  UpdateVttechkhachhang(data: any) {
    return this.vttechkhachhangs$.pipe(
      take(1),
      switchMap((vttechkhachhangs: any) =>
        this.http.patch(environment.APIURL + `/vttech_khachhang/${data.id}`, data).pipe(
          map((vttechkhachhang) => {
            const index = vttechkhachhangs.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              vttechkhachhangs[index] = data;
              this._vttechkhachhangs.next(vttechkhachhangs as any[]);
            } else {
              this._vttechkhachhangs.next([vttechkhachhang]);

            }
            return vttechkhachhang;
          })
        )
      )
    );
  }
  DeleteVttechkhachhang(id: string) {
    return this.vttechkhachhangs$.pipe(
      take(1),
      switchMap((vttechkhachhangs: any) =>
        this.http.delete(environment.APIURL + `/vttech_khachhang/${id}`).pipe(
          map((isDelete) => {
            const updateVttechkhachhang = vttechkhachhangs.filter((e: any) => e.id != id);
            this._vttechkhachhangs.next(updateVttechkhachhang);
            return isDelete;
          })
        )
      )
    );
  }
}
