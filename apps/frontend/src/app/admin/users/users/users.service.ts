import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _userss: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _users: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get userss$(): Observable<any[] | null> {
    return this._userss.asObservable();
  }
  get users$(): Observable<any | null> {
    return this._users.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllUserss() {
    return this.http.get(environment.APIURL + '/users').pipe(
      map((data: any) => { 
        this._userss.next(data);
        return data;
      })
    );
  }
  searchUsers(query:any) {
    return this.http.get(environment.APIURL + `/users/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getUsersBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/users/findslug/${slug}`).pipe(
      map((data: any) => {
        this._users.next(data);
        return data;
      })
    );
  }
  getPaginaUserss(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/users/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getUsersById(id: string) {
    return this.http.get(environment.APIURL + `/users/findid/${id}`).pipe(
      map((data: any) => {
        this._users.next(data);
        return data;
      })
    );
  }
  CreateUsers(data: any) {
    return this.userss$.pipe(
      take(1),
      switchMap((userss: any) =>
        this.http.post(environment.APIURL + '/users', data).pipe(
          map((users) => {
            if (userss?.length > 0) {
              this._userss.next([...userss, users]);
            }
            return users;
          })
        )
      )
    );
  }
  UpdateUsers(data: any) {
    return this.userss$.pipe(
      take(1),
      switchMap((userss: any) =>
        this.http.patch(environment.APIURL + `/users/${data.id}`, data).pipe(
          map((users) => {
            const index = userss.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              userss[index] = data;
              this._userss.next(userss as any[]);
            } else {
              this._userss.next([users]);

            }
            return users;
          })
        )
      )
    );
  }
  DeleteUsers(id: string) {
    return this.userss$.pipe(
      take(1),
      switchMap((userss: any) =>
        this.http.delete(environment.APIURL + `/users/${id}`).pipe(
          map((isDelete) => {
            const updateUsers = userss.filter((e: any) => e.id != id);
            this._userss.next(updateUsers);
            return isDelete;
          })
        )
      )
    );
  }
}
