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
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const redirectURL = state.url === '/dangxuat' ? '/' : state.url;
    return this._check(redirectURL);
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
          this._router.navigate(['/dangnhap'], { queryParams: { redirectURL } });
          return of(false);
        }
        return of(true);
      })
    );
  }
}
