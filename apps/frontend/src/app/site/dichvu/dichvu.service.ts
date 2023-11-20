import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DichvuService {
  private _dichvus: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _dichvu: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get dichvus$(): Observable<any[] | null> {
    return this._dichvus.asObservable();
  }
  get dichvu$(): Observable<any | null> {
    return this._dichvu.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllDichvus() {
    return this.http.get(environment.APIURL + '/dichvu').pipe(
      map((data: any) => { 
        this._dichvus.next(data);
        return data;
      })
    );
  }
  searchDichvu(query:any) {
    return this.http.get(environment.APIURL + `/dichvu/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getDichvuBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/dichvu/findslug/${slug}`).pipe(
      map((data: any) => {
        this._dichvu.next(data);
        return data;
      })
    );
  }
  getPaginaDichvus(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/dichvu/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getDichvuById(id: string) {
    return this.http.get(environment.APIURL + `/dichvu/findid/${id}`).pipe(
      map((data: any) => {
        this._dichvu.next(data);
        return data;
      })
    );
  }
  CreateDichvu(data: any) {
       return  this.http.post(environment.APIURL + '/dichvu', data).pipe(
          map(() => {
            this.getAllDichvus()
          })
        )
  }
  UpdateDichvu(data: any) {
    return this.dichvus$.pipe(
      take(1),
      switchMap((dichvus: any) =>
        this.http.patch(environment.APIURL + `/dichvu/${data.id}`, data).pipe(
          map((dichvu) => {
            const index = dichvus.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              dichvus[index] = data;
              this._dichvus.next(dichvus as any[]);
            } else {
              this._dichvus.next([dichvu]);

            }
            return dichvu;
          })
        )
      )
    );
  }
  DeleteDichvu(id: string) {
    return this.http.delete(environment.APIURL + `/dichvu/${id}`).pipe(
          map(() => {
              this.getAllDichvus()
          })
        )
  }
}
