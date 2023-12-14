import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AuthUtils } from './auth.utils';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'apps/frontend/src/environments/environment';
import { LocalStorageService } from '../localstorage.service';
import { UsersService } from './users.service';
@Injectable()
export class AuthService {
  private readonly _secret: any;
  private _authenticated: boolean = false;
  private APIURL: string = environment.APIURL;
  constructor(
    private _httpClient: HttpClient,
    private _userService: UsersService,
    private _LocalStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this._secret = 'tazaskinclinic';
  }
  set accessToken(token: string) {
    this._LocalStorageService.setItem('token', token);
  }
  get accessToken(): string {
   return this._LocalStorageService.getItem('token') ?? '';
  }
  Dangnhap(user: any): Observable<any> {
    if (this._authenticated) {
      return of([false, 'User Đã Đăng Nhập']);
    }
    return this._httpClient.post(`${this.APIURL}/auth/login`, user).pipe(
      switchMap((response: any) => {
        if (response[0]) {
          this._authenticated = true;
          this.accessToken = response[1].access_token;
        }
        return of(response);
      })
    );
  }
  checkDangnhap(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }
    if (!this.accessToken || this.accessToken === 'undefined') {
      this._LocalStorageService.removeItem('token')
      return of(false);
    }
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }
    return of(true);
    // return this.signInUsingToken();
  }
  Dangxuat(): Observable<any> {
    this._LocalStorageService.removeItem('token')
    this._authenticated = false;
    return of(true);
  }
}
