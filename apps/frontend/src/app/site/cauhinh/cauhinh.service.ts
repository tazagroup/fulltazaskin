import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CauhinhService {
  private urlApi = environment.APIURL;
  private _cauhinhs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _cauhinh: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get cauhinhs$(): Observable<any[] | null> {
    return this._cauhinhs.asObservable();
  }
  get cauhinh$(): Observable<any | null> {
    return this._cauhinh.asObservable();
  }
  constructor(private http: HttpClient) { }
  getCauhinhs() {
    return this.http.get(this.urlApi + '/cauhinh').pipe(
      map((data: any) => { 
        this._cauhinhs.next(data);
        return data;
      })
    );
  }
  searchCauhinh(query:any) {
    return this.http.get(this.urlApi + `/cauhinh/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getCauhinhBySlug(slug: string) {
    return this.http.get(this.urlApi + `/cauhinh/findslug/${slug}`).pipe(
      map((data: any) => {
        this._cauhinh.next(data);
        return data;
      })
    );
  }
  getPaginaCauhinhs(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(this.urlApi+'/cauhinh/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getCauhinhById(id: string) {
    return this.http.get(this.urlApi + `/cauhinh/findid/${id}`).pipe(
      map((data: any) => {
        this._cauhinh.next(data);
        return data;
      })
    );
  }
  postCauhinh(data: any) {
    return this.cauhinhs$.pipe(
      take(1),
      switchMap((cauhinhs: any) =>
        this.http.post(this.urlApi + '/cauhinh', data).pipe(
          map((cauhinh) => {
            if (cauhinhs?.length > 0) {
              this._cauhinhs.next([...cauhinhs, cauhinh]);
            }
            return cauhinh;
          })
        )
      )
    );
  }
  updateCauhinh(data: any) {
    return this.cauhinhs$.pipe(
      take(1),
      switchMap((cauhinhs: any) =>
        this.http.patch(this.urlApi + `/cauhinh/${data.id}`, data).pipe(
          map((cauhinh) => {
            const index = cauhinhs.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              cauhinhs[index] = data;
              this._cauhinhs.next(cauhinhs as any[]);
            } else {
              this._cauhinhs.next([cauhinh]);

            }
            return cauhinh;
          })
        )
      )
    );
  }
  deleteCauhinh(id: string) {
    return this.cauhinhs$.pipe(
      take(1),
      switchMap((cauhinhs: any) =>
        this.http.delete(this.urlApi + `/cauhinh/${id}`).pipe(
          map((isDelete) => {
            const updateCauhinh = cauhinhs.filter((e: any) => e.id != id);
            this._cauhinhs.next(updateCauhinh);
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
