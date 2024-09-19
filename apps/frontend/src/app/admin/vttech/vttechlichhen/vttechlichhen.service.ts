import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VttechlichhenService {
  private _vttechlichhens: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechlistlichhen: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechlichhen: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get vttechlichhens$(): Observable<any[] | null> {
    return this._vttechlichhens.asObservable();
  }
  get vttechlistlichhen$(): Observable<any[] | null> {
    return this._vttechlistlichhen.asObservable();
  }
  get vttechlichhen$(): Observable<any | null> {
    return this._vttechlichhen.asObservable();
  }
  constructor(private http: HttpClient) { }
  getListLichhen() {
    return this.http.get(environment.APIURL + '/vttechlichhen').pipe(
      map((data: any) => {
        this._vttechlistlichhen.next(data);
        return data;
      })
    );
  }
  getAllVttechlichhens() {
    return this.http.get(environment.APIURL + '/vttechlichhen').pipe(
      map((data: any) => {
        this._vttechlichhens.next(data);
        return data;
      })
    );
  }
  searchVttechlichhen(SearchParams:any) {
    return this.http.post(environment.APIURL + `/vttechlichhen/search`,SearchParams).pipe(
      map((data: any) => {
        console.log(data);

        this._vttechlichhens.next(data);
        return data;
      })
    );
  }
  getVttechlichhenBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/vttechlichhen/findslug/${slug}`).pipe(
      map((data: any) => {
        this._vttechlichhen.next(data);
        return data;
      })
    );
  }
  getPaginaVttechlichhens(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/vttechlichhen/pagination',{ params }).pipe(
      map((data: any) => {
        this._vttechlichhens.next(data);
        return data;
      })
    );
  }
  getVttechlichhenById(id: string) {
    return this.http.get(environment.APIURL + `/vttechlichhen/findid/${id}`).pipe(
      map((data: any) => {
        this._vttechlichhen.next(data);
        return data;
      })
    );
  }
  getLichhenbycustcode(code: string) {
    return this.http.get(environment.APIURL + `/vttechlichhen/findbycode/${code}`).pipe(
      map((data: any) => {
        return data
      })
    );
  }
  SendZns(data: any) {
    return this.http.post(environment.APIURL + '/vttechlichhen/sendcamon', data).pipe(
          map((result) => {
            console.log(result);
            return result;
          })
        )
  }
  CreateVttechlichhen(data: any) {
    return this.vttechlichhens$.pipe(
      take(1),
      switchMap((vttechlichhens: any) =>
        this.http.post(environment.APIURL + '/vttechlichhen', data).pipe(
          map((vttechlichhen) => {
            if (vttechlichhens?.length > 0) {
              this._vttechlichhens.next([...vttechlichhens, vttechlichhen]);
            }
            return vttechlichhen;
          })
        )
      )
    );
  }
  UpdateVttechlichhen(data: any) {
    return this.vttechlichhens$.pipe(
      take(1),
      switchMap((vttechlichhens: any) =>
        this.http.patch(environment.APIURL + `/vttechlichhen/${data.id}`, data).pipe(
          map((vttechlichhen) => {
            const index = vttechlichhens.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              vttechlichhens[index] = data;
              this._vttechlichhens.next(vttechlichhens as any[]);
            } else {
              this._vttechlichhens.next([vttechlichhen]);

            }
            return vttechlichhen;
          })
        )
      )
    );
  }
  DeleteVttechlichhen(id: string) {
    return this.vttechlichhens$.pipe(
      take(1),
      switchMap((vttechlichhens: any) =>
        this.http.delete(environment.APIURL + `/vttechlichhen/${id}`).pipe(
          map((isDelete) => {
            const updateVttechlichhen = vttechlichhens.filter((e: any) => e.id != id);
            this._vttechlichhens.next(updateVttechlichhen);
            return isDelete;
          })
        )
      )
    );
  }
}
