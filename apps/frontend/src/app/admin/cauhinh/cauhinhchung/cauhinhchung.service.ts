import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class CauhinhchungService {
  private _cauhinhchungs: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _cauhinhchung: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get cauhinhchungs$(): Observable<any[] | null> {
    return this._cauhinhchungs.asObservable();
  }
  get cauhinhchung$(): Observable<any | null> {
    return this._cauhinhchung.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllCauhinhchungs() {
    return this.http.get(environment.APIURL + '/cauhinhchung').pipe(
      map((data: any) => { 
        this._cauhinhchungs.next(data);
        return data;
      })
    );
  }
  TestTokenVttech() {
    const data = {
      "begin":moment().add(-1,'days').format("YYYY-MM-DD"),
      "end":moment().format("YYYY-MM-DD")
  }
    return this.http.post(environment.APIURL + '/vttech_thanhtoan/getapi',data).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  searchCauhinhchung(query:any) {
    return this.http.get(environment.APIURL + `/cauhinhchung/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getCauhinhchungBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/cauhinhchung/findslug/${slug}`).pipe(
      map((data: any) => {
        this._cauhinhchung.next(data);
        return data;
      })
    );
  }
  getPaginaCauhinhchungs(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/cauhinhchung/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getCauhinhchungById(id: string) {
    return this.http.get(environment.APIURL + `/cauhinhchung/findid/${id}`).pipe(
      map((data: any) => {
        this._cauhinhchung.next(data);
        return data;
      })
    );
  }
  CreateCauhinhchung(data: any) {
    return this.cauhinhchungs$.pipe(
      take(1),
      switchMap((cauhinhchungs: any) =>
        this.http.post(environment.APIURL + '/cauhinhchung', data).pipe(
          map((cauhinhchung) => {
            if (cauhinhchungs?.length > 0) {
              this._cauhinhchungs.next([...cauhinhchungs, cauhinhchung]);
            }
            return cauhinhchung;
          })
        )
      )
    );
  }
  UpdateCauhinhchung(data: any) {
    return this.cauhinhchungs$.pipe(
      take(1),
      switchMap((cauhinhchungs: any) =>
        this.http.patch(environment.APIURL + `/cauhinhchung/${data.id}`, data).pipe(
          map((cauhinhchung) => {
            const index = cauhinhchungs.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              cauhinhchungs[index] = data;
              this._cauhinhchungs.next(cauhinhchungs as any[]);
            } else {
              this._cauhinhchungs.next([cauhinhchung]);

            }
            return cauhinhchung;
          })
        )
      )
    );
  }
  DeleteCauhinhchung(id: string) {
    return this.cauhinhchungs$.pipe(
      take(1),
      switchMap((cauhinhchungs: any) =>
        this.http.delete(environment.APIURL + `/cauhinhchung/${id}`).pipe(
          map((isDelete) => {
            const updateCauhinhchung = cauhinhchungs.filter((e: any) => e.id != id);
            this._cauhinhchungs.next(updateCauhinhchung);
            return isDelete;
          })
        )
      )
    );
  }
}
