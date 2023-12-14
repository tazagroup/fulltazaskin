import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of,switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { NotifierService } from 'angular-notifier';
@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private _authService: AuthService,
    private _router: Router,
    private _notifierService: NotifierService,
    ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._check();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check();
  }
  private _check(): Observable<boolean> {
    return this._authService.checkDangnhap().pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          //this._notifierService.notify('error','Đang Đăng Nhập Tài Khoản')
          this._router.navigate(['']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
