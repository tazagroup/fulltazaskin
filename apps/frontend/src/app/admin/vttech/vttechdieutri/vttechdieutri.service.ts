import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VttechdieutriService {
  private _vttechdieutris: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechlistdieutri: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechdieutri: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get vttechdieutris$(): Observable<any[] | null> {
    return this._vttechdieutris.asObservable();
  }
  get vttechlistdieutri$(): Observable<any[] | null> {
    return this._vttechlistdieutri.asObservable();
  }
  get vttechdieutri$(): Observable<any | null> {
    return this._vttechdieutri.asObservable();
  }
  constructor(private http: HttpClient) { }
  getListDieutri() {
    return this.http.get(environment.APIURL + '/vttechdieutri').pipe(
      map((data: any) => {
        this._vttechlistdieutri.next(data);
        return data;
      })
    );
  }
  getAllVttechdieutris() {
    return this.http.get(environment.APIURL + '/vttechdieutri').pipe(
      map((data: any) => {
        this._vttechdieutris.next(data);
        return data;
      })
    );
  }
  searchVttechdieutri(SearchParams:any) {
    return this.http.post(environment.APIURL + `/vttechdieutri/search`,SearchParams).pipe(
      map((data: any) => {
        console.log(data);

        this._vttechdieutris.next(data);
        return data;
      })
    );
  }
  getVttechdieutriBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/vttechdieutri/findslug/${slug}`).pipe(
      map((data: any) => {
        this._vttechdieutri.next(data);
        return data;
      })
    );
  }
  getPaginaVttechdieutris(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/vttechdieutri/pagination',{ params }).pipe(
      map((data: any) => {
        this._vttechdieutris.next(data);
        return data;
      })
    );
  }
  getVttechdieutriById(id: string) {
    return this.http.get(environment.APIURL + `/vttechdieutri/findid/${id}`).pipe(
      map((data: any) => {
        this._vttechdieutri.next(data);
        return data;
      })
    );
  }
  getDieutribycustcode(code: string) {
    return this.http.get(environment.APIURL + `/vttechdieutri/bycustcode/${code}`).pipe(
      map((data: any) => {
        return data
      })
    );
  }
  SendZns(data: any) {
    return this.http.post(environment.APIURL + '/vttechdieutri/sendcamon', data).pipe(
          map((result) => {
            console.log(result);
            return result;
          })
        )
  }
  CreateVttechdieutri(data: any) {
    return this.vttechdieutris$.pipe(
      take(1),
      switchMap((vttechdieutris: any) =>
        this.http.post(environment.APIURL + '/vttechdieutri', data).pipe(
          map((vttechdieutri) => {
            if (vttechdieutris?.length > 0) {
              this._vttechdieutris.next([...vttechdieutris, vttechdieutri]);
            }
            return vttechdieutri;
          })
        )
      )
    );
  }
  UpdateVttechdieutri(data: any) {
    return this.vttechdieutris$.pipe(
      take(1),
      switchMap((vttechdieutris: any) =>
        this.http.patch(environment.APIURL + `/vttechdieutri/${data.id}`, data).pipe(
          map((vttechdieutri) => {
            const index = vttechdieutris.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              vttechdieutris[index] = data;
              this._vttechdieutris.next(vttechdieutris as any[]);
            } else {
              this._vttechdieutris.next([vttechdieutri]);

            }
            return vttechdieutri;
          })
        )
      )
    );
  }
  DeleteVttechdieutri(id: string) {
    return this.vttechdieutris$.pipe(
      take(1),
      switchMap((vttechdieutris: any) =>
        this.http.delete(environment.APIURL + `/vttechdieutri/${id}`).pipe(
          map((isDelete) => {
            const updateVttechdieutri = vttechdieutris.filter((e: any) => e.id != id);
            this._vttechdieutris.next(updateVttechdieutri);
            return isDelete;
          })
        )
      )
    );
  }
}
