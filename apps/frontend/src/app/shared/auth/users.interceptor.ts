import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class UsersInterceptor implements HttpInterceptor {

  constructor(
    private _notifierService: NotifierService,
      ) {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(catchError((error: HttpErrorResponse) => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent) {
                console.log('This is client side error');
                errorMsg = `Error: ${error.message}`;
            } else {
                this._notifierService.show({
                  message: "Có Lỗi. Kiểm Tra Lại",
                  type: 'error',
                });
              console.log(error.error);  
            }
            return throwError(errorMsg);
        })
    )
  }
}
