import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HangthanhvienService {
  private _hangthanhviens: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _hangthanhvien: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get hangthanhviens$(): Observable<any[] | null> {
    return this._hangthanhviens.asObservable();
  }
  get hangthanhvien$(): Observable<any | null> {
    return this._hangthanhvien.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllHangthanhviens() {
    return this.http.get(environment.APIURL + '/hangthanhvien').pipe(
      map((data: any) => { 
        this._hangthanhviens.next(data);
        return data;
      })
    );
  }
  searchHangthanhvien(query:any) {
    return this.http.get(environment.APIURL + `/hangthanhvien/search?query=query`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getHangthanhvienBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/hangthanhvien/findslug/${slug}`).pipe(
      map((data: any) => {
        this._hangthanhvien.next(data);
        return data;
      })
    );
  }
  getPaginaHangthanhviens(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/hangthanhvien/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getHangthanhvienById(id: string) {
    return this.http.get(environment.APIURL + `/hangthanhvien/findid/${id}`).pipe(
      map((data: any) => {
        this._hangthanhvien.next(data);
        return data;
      })
    );
  }
  CreateHangthanhvien(data: any) {
    return this.hangthanhviens$.pipe(
      take(1),
      switchMap((hangthanhviens: any) =>
        this.http.post(environment.APIURL + '/hangthanhvien', data).pipe(
          map((hangthanhvien) => {
            if (hangthanhviens?.length > 0) {
              this._hangthanhviens.next([...hangthanhviens, hangthanhvien]);
            }
            return hangthanhvien;
          })
        )
      )
    );
  }
  UpdateHangthanhvien(data: any) {
    return this.hangthanhviens$.pipe(
      take(1),
      switchMap((hangthanhviens: any) =>
        this.http.patch(environment.APIURL + `/hangthanhvien/${data.id}`, data).pipe(
          map((hangthanhvien) => {
            const index = hangthanhviens.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              hangthanhviens[index] = data;
              this._hangthanhviens.next(hangthanhviens as any[]);
            } else {
              this._hangthanhviens.next([hangthanhvien]);

            }
            return hangthanhvien;
          })
        )
      )
    );
  }
  DeleteHangthanhvien(id: string) {
    return this.hangthanhviens$.pipe(
      take(1),
      switchMap((hangthanhviens: any) =>
        this.http.delete(environment.APIURL + `/hangthanhvien/${id}`).pipe(
          map((isDelete) => {
            const updateHangthanhvien = hangthanhviens.filter((e: any) => e.id != id);
            this._hangthanhviens.next(updateHangthanhvien);
            return isDelete;
          })
        )
      )
    );
  }
}
