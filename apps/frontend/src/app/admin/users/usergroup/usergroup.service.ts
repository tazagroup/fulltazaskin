import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsergroupService {
  private _usergroups: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _usergroup: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get usergroups$(): Observable<any[] | null> {
    return this._usergroups.asObservable();
  }
  get usergroup$(): Observable<any | null> {
    return this._usergroup.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllUsergroups() {
    return this.http.get(environment.APIURL + '/usergroup').pipe(
      map((data: any) => { 
        this._usergroups.next(data);
        return data;
      })
    );
  }
  searchUsergroup(query:any) {
    return this.http.get(environment.APIURL + `/usergroup/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getUsergroupBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/usergroup/findslug/${slug}`).pipe(
      map((data: any) => {
        this._usergroup.next(data);
        return data;
      })
    );
  }
  getPaginaUsergroups(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/usergroup/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getUsergroupById(id: string) {
    return this.http.get(environment.APIURL + `/usergroup/findid/${id}`).pipe(
      map((data: any) => {
        this._usergroup.next(data);
        return data;
      })
    );
  }
  CreateUsergroup(data: any) {
    return this.usergroups$.pipe(
      take(1),
      switchMap((usergroups: any) =>
        this.http.post(environment.APIURL + '/usergroup', data).pipe(
          map((usergroup) => {
            if (usergroups?.length > 0) {
              this._usergroups.next([...usergroups, usergroup]);
            }
            return usergroup;
          })
        )
      )
    );
  }
  UpdateUsergroup(data: any) {
    return this.http.patch(environment.APIURL + `/usergroup/${data.id}`, data).pipe(
          map((usergroup) => {
              this._usergroup.next(usergroup);
          })
        )
  }
  DeleteUsergroup(id: string) {
    return this.usergroups$.pipe(
      take(1),
      switchMap((usergroups: any) =>
        this.http.delete(environment.APIURL + `/usergroup/${id}`).pipe(
          map((isDelete) => {
            const updateUsergroup = usergroups.filter((e: any) => e.id != id);
            this._usergroups.next(updateUsergroup);
            return isDelete;
          })
        )
      )
    );
  }
}
