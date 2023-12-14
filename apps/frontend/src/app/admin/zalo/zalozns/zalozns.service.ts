import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ZaloznsService {
  private _zaloznss: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _zalozns: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get zaloznss$(): Observable<any[] | null> {
    return this._zaloznss.asObservable();
  }
  get zalozns$(): Observable<any | null> {
    return this._zalozns.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllZaloznss() {
    return this.http.get(environment.APIURL + '/zalozns').pipe(
      map((data: any) => { 
        this._zaloznss.next(data);
        return data;
      })
    );
  }
  getRatingbyMsgID(msg_id:any) {
    return this.http.get(environment.APIURL + `/zalozns/getrating/${msg_id}`).pipe(
      map((data: any) => { 
        console.log(data);
        
        // this._zaloznss.next(data);
         return data;
      })
    );
  }
  sendZns(item:any) {
    return this.http.post(environment.APIURL + '/zalozns/sendZns',item).pipe(
      map((data: any) => { 
        console.log(data);
      })
    );
  }
  searchZalozns(query:any) {
    return this.http.get(environment.APIURL + `/zalozns/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getZaloznsBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/zalozns/findslug/${slug}`).pipe(
      map((data: any) => {
        this._zalozns.next(data);
        return data;
      })
    );
  }
  getPaginaZaloznss(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/zalozns/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getZaloznsById(id: string) {
    return this.http.get(environment.APIURL + `/zalozns/findid/${id}`).pipe(
      map((data: any) => {
        this._zalozns.next(data);
        return data;
      })
    );
  }
  CreateZalozns(data: any) {
    return this.zaloznss$.pipe(
      take(1),
      switchMap((zaloznss: any) =>
        this.http.post(environment.APIURL + '/zalozns', data).pipe(
          map((zalozns) => {
            if (zaloznss?.length > 0) {
              this._zaloznss.next([...zaloznss, zalozns]);
            }
            return zalozns;
          })
        )
      )
    );
  }
  UpdateZalozns(data: any) {
    return this.zaloznss$.pipe(
      take(1),
      switchMap((zaloznss: any) =>
        this.http.patch(environment.APIURL + `/zalozns/${data.id}`, data).pipe(
          map((zalozns) => {
            const index = zaloznss.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              zaloznss[index] = data;
              this._zaloznss.next(zaloznss as any[]);
            } else {
              this._zaloznss.next([zalozns]);

            }
            return zalozns;
          })
        )
      )
    );
  }
  DeleteZalozns(id: string) {
    return this.zaloznss$.pipe(
      take(1),
      switchMap((zaloznss: any) =>
        this.http.delete(environment.APIURL + `/zalozns/${id}`).pipe(
          map((isDelete) => {
            const updateZalozns = zaloznss.filter((e: any) => e.id != id);
            this._zaloznss.next(updateZalozns);
            return isDelete;
          })
        )
      )
    );
  }
}
