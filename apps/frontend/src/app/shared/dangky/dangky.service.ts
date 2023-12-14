import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { LocalStorageService } from '../../shared/localstorage.service';
import { environment } from 'apps/frontend/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DangkyService {
  private _authenticate = false;
  private _authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly notifier: NotifierService;
  private _nhanvien: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _nhanviens: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _user: ReplaySubject<any> = new ReplaySubject<any>(1);

  set accessToken(token: string) {
    this._LocalStorageService.setItem('accessToken_Custom', token);
  }

  get accessToken(): string {
    return this._LocalStorageService.getItem('accessToken_Custom') ?? '';
  }
  constructor(
    private _httpClient: HttpClient,
    private _LocalStorageService: LocalStorageService,
    notifierService: NotifierService // private _notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }
  get authenticated$(): Observable<boolean> {
    return this._authenticated.asObservable();
  }
  get nhanvien$(): Observable<any> {
    return this._nhanvien.asObservable();
  }
  get nhanviens$(): Observable<any[]> {
    return this._nhanviens.asObservable();
  }
  set user(value: any) {
    this._user.next(value);
  }
  get user$(): Observable<any> {
    return this._user.asObservable();
  }
  getUsers() {
    return this._httpClient.get(environment.APIURL + `/user-khachhang`).pipe(
      map((users) => {
        this._nhanviens.next(users);
        return users;
      })
    );
  }
  signIn(credentials: { username: string; password: string }): Observable<any> {
    if (this._authenticate) {
      return throwError('User is already logged in.');
    }
    return this._httpClient
      .post(`${environment.APIURL}/auth/login`, credentials)
      .pipe(
        switchMap((response: any) => {
          if (response[0]) {
            this.accessToken = response[1].access_token;
            this._authenticate = true;
            this._authenticated.next(true);
            this._user.next(response[1].data)
            return of(response);
          } else {
            this.notifier.notify(
              'error',
              `Số Điện Thoại Hoặc Mật Khẩu Không Đúng`
            );
            // this._userService.user = response.user;
          }
          return of(response);
        })
      );
  }

  createNhanvien(data: any): Observable<any> {
    return this.nhanviens$.pipe(
      take(1),
      switchMap((nhanviens) =>
        this._httpClient
          .post<any>(`${environment.APIURL}/user-khachhang/dangky`, data)
          .pipe(
            map((result) => {
              const newNhanvien = result;
              // this._nhanviens.next([
              //     newNhanvien,
              //     ...nhanviens,
              // ]);
              return newNhanvien;
            })
          )
      )
    );
  }
  updateNhanvien(id: string, data: any): Observable<any> {
    return this.nhanviens$.pipe(
      take(1),
      switchMap((nhanviens) =>
        this._httpClient
          .patch<any>(`${environment.APIURL}/user-khachhang/${id}`, data)
          .pipe(
            map((updatedNhanvien) => {
              console.log(updatedNhanvien);

              return updatedNhanvien;
            }),
            switchMap((updatedNhanvien) =>
              this.nhanvien$.pipe(
                take(1),
                filter((item) => item && item.id === id),
                tap(() => {
                  this._nhanvien.next(updatedNhanvien);
                  return updatedNhanvien;
                })
              )
            )
          )
      )
    );
  }
  signInUsingToken(token: string): Observable<any> {
    return this._httpClient
      .post(`${environment.APIURL}/auth/signbytoken`, {
        // access_token: this.accessToken,
        access_token: token,
      })
      .pipe(
        switchMap((response: any) => {
          if (response !== false) {
            this._authenticate = true;
            this._authenticated.next(true);
            this.user = response
            this._user.next(response)
            return of(true);
          } else return of(false);
        })
      );
  }
  changepass(data: {
    user: any;
    oldpass: string;
    newpass: string;
  }): Observable<any> {
    return this._httpClient
      .post(`${environment.APIURL}/user-khachhang/changepass`, data)
      .pipe(
        tap((response: any) => {
          console.log(response);

          return response;
        })
      );
  }
  signOut(): Observable<any> {
    this._LocalStorageService.removeItem('accessToken_Custom');
    this._user.next(null)
    this._authenticated.next(false);
    this._authenticate = false;
    return of(true);
  }
  checkDangnhap(): Observable<boolean> {
    if (this._authenticate) {
      this._authenticated.next(true)
      return of(true);
    }
    if (!this.accessToken || this.accessToken === 'undefined') {
      this._LocalStorageService.removeItem('accessToken_Custom');
      return of(false);
    }
    // if (AuthUtils.isTokenExpired(this.accessToken)) {
    //     return of(false);
    // }
    return of(true);
    // return this.signInUsingToken();
  }
}
