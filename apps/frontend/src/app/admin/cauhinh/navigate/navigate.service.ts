import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NavigateService {
  private _navigates: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _navigate: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get navigates$(): Observable<any[] | null> {
    return this._navigates.asObservable();
  }
  get navigate$(): Observable<any | null> {
    return this._navigate.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllNavigates() {
    return this.http.get(environment.APIURL + '/navigate').pipe(
      map((data: any) => { 
        this._navigates.next(data);
        return data;
      })
    );
  }
  searchNavigate(query:any) {
    return this.http.get(environment.APIURL + `/navigate/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getNavigateBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/navigate/findslug/${slug}`).pipe(
      map((data: any) => {
        this._navigate.next(data);
        return data;
      })
    );
  }
  getPaginaNavigates(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/navigate/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getNavigateById(id: string) {
    return this.http.get(environment.APIURL + `/navigate/findid/${id}`).pipe(
      map((data: any) => {
        this._navigate.next(data);
        return data;
      })
    );
  }
  CreateNavigate(data: any) {
    return this.navigates$.pipe(
      take(1),
      switchMap((navigates: any) =>
        this.http.post(environment.APIURL + '/navigate', data).pipe(
          map((navigate) => {
            if (navigates?.length > 0) {
              this._navigates.next([...navigates, navigate]);
            }
            return navigate;
          })
        )
      )
    );
  }
  UpdateNavigate(data: any) {
    return this.navigates$.pipe(
      take(1),
      switchMap((navigates: any) =>
        this.http.patch(environment.APIURL + `/navigate/${data.id}`, data).pipe(
          map((navigate) => {
            const index = navigates.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              navigates[index] = data;
              this._navigates.next(navigates as any[]);
            } else {
              this._navigates.next([navigate]);

            }
            return navigate;
          })
        )
      )
    );
  }
  DeleteNavigate(id: string) {
    return this.navigates$.pipe(
      take(1),
      switchMap((navigates: any) =>
        this.http.delete(environment.APIURL + `/navigate/${id}`).pipe(
          map((isDelete) => {
            const updateNavigate = navigates.filter((e: any) => e.id != id);
            this._navigates.next(updateNavigate);
            return isDelete;
          })
        )
      )
    );
  }
}
