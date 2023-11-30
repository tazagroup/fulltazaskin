import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChinhanhService {
  private _chinhanhs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _chinhanh: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get chinhanhs$(): Observable<any[] | null> {
    return this._chinhanhs.asObservable();
  }
  get chinhanh$(): Observable<any | null> {
    return this._chinhanh.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllChinhanhs() {
    return this.http.get(environment.APIURL + '/chinhanh').pipe(
      map((data: any) => { 
        this._chinhanhs.next(data);
        return data;
      })
    );
  }
  searchChinhanh(query:any) {
    return this.http.get(environment.APIURL + `/chinhanh/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getChinhanhBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/chinhanh/findslug/${slug}`).pipe(
      map((data: any) => {
        this._chinhanh.next(data);
        return data;
      })
    );
  }
  getPaginaChinhanhs(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/chinhanh/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getChinhanhById(id: string) {
    return this.http.get(environment.APIURL + `/chinhanh/findid/${id}`).pipe(
      map((data: any) => {
        this._chinhanh.next(data);
        return data;
      })
    );
  }
  CreateChinhanh(data: any) {
    return this.chinhanhs$.pipe(
      take(1),
      switchMap((chinhanhs: any) =>
        this.http.post(environment.APIURL + '/chinhanh', data).pipe(
          map((chinhanh) => {
            if (chinhanhs?.length > 0) {
              this._chinhanhs.next([...chinhanhs, chinhanh]);
            }
            return chinhanh;
          })
        )
      )
    );
  }
  UpdateChinhanh(data: any) {
    return this.chinhanhs$.pipe(
      take(1),
      switchMap((chinhanhs: any) =>
        this.http.patch(environment.APIURL + `/chinhanh/${data.id}`, data).pipe(
          map((chinhanh) => {
            const index = chinhanhs.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              chinhanhs[index] = data;
              this._chinhanhs.next(chinhanhs as any[]);
            } else {
              this._chinhanhs.next([chinhanh]);

            }
            return chinhanh;
          })
        )
      )
    );
  }
  DeleteChinhanh(id: string) {
    return this.chinhanhs$.pipe(
      take(1),
      switchMap((chinhanhs: any) =>
        this.http.delete(environment.APIURL + `/chinhanh/${id}`).pipe(
          map((isDelete) => {
            const updateChinhanh = chinhanhs.filter((e: any) => e.id != id);
            this._chinhanhs.next(updateChinhanh);
            return isDelete;
          })
        )
      )
    );
  }
}
