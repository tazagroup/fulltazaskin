import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LichhenService {
  private _lichhens: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _lichhen: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get lichhens$(): Observable<any[] | null> {
    return this._lichhens.asObservable();
  }
  get lichhen$(): Observable<any | null> {
    return this._lichhen.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllLichhens() {
    return this.http.get(environment.APIURL + '/lichhen').pipe(
      map((data: any) => { 
        this._lichhens.next(data);
        return data;
      })
    );
  }
  searchLichhen(query:any) {
    return this.http.get(environment.APIURL + `/lichhen/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getLichhenBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/lichhen/findslug/${slug}`).pipe(
      map((data: any) => {
        this._lichhen.next(data);
        return data;
      })
    );
  }
  getPaginaLichhens(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/lichhen/pagination',{ params }).pipe(
      map((data: any) => {
        this._lichhens.next(data);
        return data;
      })
    );
  }
  getLichhenById(id: string) {
    return this.http.get(environment.APIURL + `/lichhen/findid/${id}`).pipe(
      map((data: any) => {
        this._lichhen.next(data);
        return data;
      })
    );
  }
  CreateLichhen(data: any) {
    return this.lichhens$.pipe(
      take(1),
      switchMap((lichhens: any) =>
        this.http.post(environment.APIURL + '/lichhen', data).pipe(
          map((lichhen) => {
            if (lichhens?.length > 0) {
              this._lichhens.next([...lichhens, lichhen]);
            }
            return lichhen;
          })
        )
      )
    );
  }
  UpdateLichhen(data: any) {
    return this.http.patch(environment.APIURL + `/lichhen/${data.id}`, data).pipe(
          map((lichhen) => {
              this._lichhen.next(lichhen);
          })
    );
  }
  DeleteLichhen(id: string) {
    return this.lichhens$.pipe(
      take(1),
      switchMap((lichhens: any) =>
        this.http.delete(environment.APIURL + `/lichhen/${id}`).pipe(
          map((isDelete) => {
            const updateLichhen = lichhens.filter((e: any) => e.id != id);
            this._lichhens.next(updateLichhen);
            return isDelete;
          })
        )
      )
    );
  }
}
