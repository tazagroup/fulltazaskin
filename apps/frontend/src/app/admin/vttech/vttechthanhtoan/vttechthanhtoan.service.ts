import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VttechthanhtoanService {
  private _vttechthanhtoans: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _vttechthanhtoan: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get vttechthanhtoans$(): Observable<any[] | null> {
    return this._vttechthanhtoans.asObservable();
  }
  get vttechthanhtoan$(): Observable<any | null> {
    return this._vttechthanhtoan.asObservable();
  }
  constructor(private http: HttpClient) { }

  // getAllAPIVttech() {
  //   return this.http.get(environment.APIURL + '/vttechthanhtoan/apirealtime').pipe(
  //     map((data: any) => { 
  //       this._vttechthanhtoans.next(data);
  //       return data;
  //     })
  //   );
  // }
  LoadServer(data:any) {
    return this.http.post(environment.APIURL + '/vttechthanhtoan/getapi',data).pipe(
      map((data: any) => { 
        console.log(data);   
      })
    );
  }
  getAllVttechthanhtoans() {
    return this.http.get(environment.APIURL + '/vttechthanhtoan').pipe(
      map((data: any) => { 
        this._vttechthanhtoans.next(data);
        return data;
      })
    );
  }
  searchVttechthanhtoan(SearchParams:any) {
    return this.http.post(environment.APIURL + `/vttechthanhtoan/search`,SearchParams).pipe(
      map((data: any) => { 
        console.log(data);
        
        this._vttechthanhtoans.next(data);
        return data;
      })
    );
  }
  getVttechthanhtoanBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/vttechthanhtoan/findslug/${slug}`).pipe(
      map((data: any) => {
        this._vttechthanhtoan.next(data);
        return data;
      })
    );
  }
  getPaginaVttechthanhtoans(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/vttechthanhtoan/pagination',{ params }).pipe(
      map((data: any) => {
        this._vttechthanhtoans.next(data);
        return data;
      })
    );
  }
  getVttechthanhtoanById(id: string) {
    return this.http.get(environment.APIURL + `/vttechthanhtoan/findid/${id}`).pipe(
      map((data: any) => {
        this._vttechthanhtoan.next(data);
        return data;
      })
    );
  }
  SendZns(data: any) {
    return this.http.post(environment.APIURL + '/vttechthanhtoan/send1zns', data).pipe(
          map((result) => {
            console.log(result); 
            return result;
          })
        )
  }
  CreateVttechthanhtoan(data: any) {
    return this.vttechthanhtoans$.pipe(
      take(1),
      switchMap((vttechthanhtoans: any) =>
        this.http.post(environment.APIURL + '/vttechthanhtoan', data).pipe(
          map((vttechthanhtoan) => {
            if (vttechthanhtoans?.length > 0) {
              this._vttechthanhtoans.next([...vttechthanhtoans, vttechthanhtoan]);
            }
            return vttechthanhtoan;
          })
        )
      )
    );
  }
  UpdateVttechthanhtoan(data: any) {
    return this.vttechthanhtoans$.pipe(
      take(1),
      switchMap((vttechthanhtoans: any) =>
        this.http.patch(environment.APIURL + `/vttechthanhtoan/${data.id}`, data).pipe(
          map((vttechthanhtoan) => {
            const index = vttechthanhtoans.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              vttechthanhtoans[index] = data;
              this._vttechthanhtoans.next(vttechthanhtoans as any[]);
            } else {
              this._vttechthanhtoans.next([vttechthanhtoan]);

            }
            return vttechthanhtoan;
          })
        )
      )
    );
  }
  DeleteVttechthanhtoan(id: string) {
    return this.vttechthanhtoans$.pipe(
      take(1),
      switchMap((vttechthanhtoans: any) =>
        this.http.delete(environment.APIURL + `/vttechthanhtoan/${id}`).pipe(
          map((isDelete) => {
            const updateVttechthanhtoan = vttechthanhtoans.filter((e: any) => e.id != id);
            this._vttechthanhtoans.next(updateVttechthanhtoan);
            return isDelete;
          })
        )
      )
    );
  }
}
