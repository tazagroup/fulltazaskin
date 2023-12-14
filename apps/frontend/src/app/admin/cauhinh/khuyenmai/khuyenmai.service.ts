import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KhuyenmaiService {
  private _khuyenmais: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _khuyenmai: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get khuyenmais$(): Observable<any[] | null> {
    return this._khuyenmais.asObservable();
  }
  get khuyenmai$(): Observable<any | null> {
    return this._khuyenmai.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllKhuyenmais() {
    return this.http.get(environment.APIURL + '/khuyenmai').pipe(
      map((data: any) => { 
        this._khuyenmais.next(data);
        return data;
      })
    );
  }
  searchKhuyenmai(query:any) {
    return this.http.get(environment.APIURL + `/khuyenmai/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getKhuyenmaiBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/khuyenmai/findslug/${slug}`).pipe(
      map((data: any) => {
        this._khuyenmai.next(data);
        return data;
      })
    );
  }
  getPaginaKhuyenmais(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/khuyenmai/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getKhuyenmaiById(id: string) {
    return this.http.get(environment.APIURL + `/khuyenmai/findid/${id}`).pipe(
      map((data: any) => {
        this._khuyenmai.next(data);
        return data;
      })
    );
  }
  CreateKhuyenmai(data: any) {
    return this.khuyenmais$.pipe(
      take(1),
      switchMap((khuyenmais: any) =>
        this.http.post(environment.APIURL + '/khuyenmai', data).pipe(
          map((khuyenmai) => {
            if (khuyenmais?.length > 0) {
              this._khuyenmais.next([...khuyenmais, khuyenmai]);
            }
            return khuyenmai;
          })
        )
      )
    );
  }
  UpdateKhuyenmai(data: any) {
    return this.khuyenmais$.pipe(
      take(1),
      switchMap((khuyenmais: any) =>
        this.http.patch(environment.APIURL + `/khuyenmai/${data.id}`, data).pipe(
          map((khuyenmai) => {
            const index = khuyenmais.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              khuyenmais[index] = data;
              this._khuyenmais.next(khuyenmais as any[]);
            } else {
              this._khuyenmais.next([khuyenmai]);

            }
            return khuyenmai;
          })
        )
      )
    );
  }
  DeleteKhuyenmai(id: string) {
    return this.khuyenmais$.pipe(
      take(1),
      switchMap((khuyenmais: any) =>
        this.http.delete(environment.APIURL + `/khuyenmai/${id}`).pipe(
          map((isDelete) => {
            const updateKhuyenmai = khuyenmais.filter((e: any) => e.id != id);
            this._khuyenmais.next(updateKhuyenmai);
            return isDelete;
          })
        )
      )
    );
  }
}
