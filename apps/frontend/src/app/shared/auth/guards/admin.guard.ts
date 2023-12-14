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
import { Observable, map, of, switchMap, take } from 'rxjs';
import { AuthService } from '../auth.service';
import { NotifierService } from 'angular-notifier';
import { UsersService } from '../users.service';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private _authService: AuthService, 
    private _usersService: UsersService, 
    private _notifierService: NotifierService, 
    private _router: Router
    ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const redirectURL = state.url === '/dangxuat' ? '/' : state.url;
    let checkLogin;
    this._check(redirectURL).subscribe((data)=>{checkLogin =data});
    if(checkLogin)
    {
      return this._usersService.getProfile().pipe(
        take(1),
        map((user:any) => {
          if (user && user.Role === 'admin') {
            return true;
          } else {
            this._notifierService.notify('error','Không Có Quyền Truy Cập')
            this._router.navigate(['/']);
            return false;
          }
        })
      );
    }
    else
    {
      this._router.navigate(['/dangnhap'], { queryParams: { redirectURL } });
      return false;
    }
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const redirectURL = state.url === '/dangxuat' ? '/' : state.url;

    return this._check(redirectURL);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._check('/');
  }
  private _check(redirectURL: string): Observable<boolean> {
    return this._authService.checkDangnhap().pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          return of(false);
        }
        return of(true)
      })
    );
  }
}

