import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private _menus: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _menu: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get menus$(): Observable<any[] | null> {
    return this._menus.asObservable();
  }
  get menu$(): Observable<any | null> {
    return this._menu.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllMenus() {
    return this.http.get(environment.APIURL + '/menu').pipe(
      map((data: any) => { 
        this._menus.next(data);
        return data;
      })
    );
  }
  searchMenu(query:any) {
    return this.http.get(environment.APIURL + `/menu/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getMenuBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/menu/findslug/${slug}`).pipe(
      map((data: any) => {
        this._menu.next(data);
        return data;
      })
    );
  }
  getPaginaMenus(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/menu/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getMenuById(id: string) {
    return this.http.get(environment.APIURL + `/menu/findid/${id}`).pipe(
      map((data: any) => {
        this._menu.next(data);
        return data;
      })
    );
  }
  CreateMenu(data: any) {
    return this.menus$.pipe(
      take(1),
      switchMap((menus: any) =>
        this.http.post(environment.APIURL + '/menu', data).pipe(
          map((menu) => {
            if (menus?.length > 0) {
              this._menus.next([...menus, menu]);
            }
            return menu;
          })
        )
      )
    );
  }
  UpdateMenu(data: any) {
    return this.menus$.pipe(
      take(1),
      switchMap((menus: any) =>
        this.http.patch(environment.APIURL + `/menu/${data.id}`, data).pipe(
          map((menu) => {
            const index = menus.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              menus[index] = data;
              this._menus.next(menus as any[]);
            } else {
              this._menus.next([menu]);

            }
            return menu;
          })
        )
      )
    );
  }
  DeleteMenu(id: string) {
    return this.menus$.pipe(
      take(1),
      switchMap((menus: any) =>
        this.http.delete(environment.APIURL + `/menu/${id}`).pipe(
          map((isDelete) => {
            const updateMenu = menus.filter((e: any) => e.id != id);
            this._menus.next(updateMenu);
            return isDelete;
          })
        )
      )
    );
  }
}
