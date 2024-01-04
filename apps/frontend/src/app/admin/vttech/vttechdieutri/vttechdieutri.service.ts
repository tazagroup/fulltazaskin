import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VttechdieutriService {
  private _vttechdieutris: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechdieutri: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get vttechdieutris$(): Observable<any[] | null> {
    return this._vttechdieutris.asObservable();
  }
  get vttechdieutri$(): Observable<any | null> {
    return this._vttechdieutri.asObservable();
  }
  constructor(private http: HttpClient) { }
  getAllVttechdieutris() {
    return this.http.get(environment.APIURL + '/vttech_dieutri').pipe(
      map((data: any) => { 
        this._vttechdieutris.next(data);
        return data;
      })
    );
  }
  searchVttechdieutri(SearchParams:any) {
    return this.http.post(environment.APIURL + `/vttech_dieutri/search`,SearchParams).pipe(
      map((data: any) => { 
        this._vttechdieutris.next(data);
        return data;
      })
    );
  }
  getVttechdieutriBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/vttech_dieutri/findslug/${slug}`).pipe(
      map((data: any) => {
        this._vttechdieutri.next(data);
        return data;
      })
    );
  }
  getPaginaVttechdieutris(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/vttech_dieutri/pagination',{ params }).pipe(
      map((data: any) => {
        this._vttechdieutris.next(data);
        return data;
      })
    );
  }
  getVttechdieutriById(id: string) {
    return this.http.get(environment.APIURL + `/vttech_dieutri/findid/${id}`).pipe(
      map((data: any) => {
        this._vttechdieutri.next(data);
        return data;
      })
    );
  }
  SendZns(data: any) {
    return this.http.post(environment.APIURL + '/vttech/vttech_sendznsdieutri', data).pipe(
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
        this.http.post(environment.APIURL + '/vttech_dieutri', data).pipe(
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
        this.http.patch(environment.APIURL + `/vttech_dieutri/${data.id}`, data).pipe(
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
        this.http.delete(environment.APIURL + `/vttech_dieutri/${id}`).pipe(
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
