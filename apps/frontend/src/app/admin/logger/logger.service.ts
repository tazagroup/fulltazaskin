import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private _loggers: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _logger: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get loggers$(): Observable<any[] | null> {
    return this._loggers.asObservable();
  }
  get logger$(): Observable<any | null> {
    return this._logger.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllLoggers() {
    return this.http.get(environment.APIURL + '/logger').pipe(
      map((data: any) => { 
        this._loggers.next(data);
        return data;
      })
    );
  }
  searchVttechthanhtoan(SearchParams:any) {
    return this.http.post(environment.APIURL + `/logger/search`,SearchParams).pipe(
      map((data: any) => { 
        this._loggers.next(data);
        return data;
      })
    );
  }
  getLoggerBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/logger/findslug/${slug}`).pipe(
      map((data: any) => {
        this._logger.next(data);
        return data;
      })
    );
  }
  getPaginaLoggers(page: number, perPage: number) {
    const params ={ page: String(page), perPage: String(perPage) }
    return this.http.get(environment.APIURL+'/logger/pagination',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getLoggerById(id: string) {
    return this.http.get(environment.APIURL + `/logger/findid/${id}`).pipe(
      map((data: any) => {
        this._logger.next(data);
        return data;
      })
    );
  }
  CreateLogger(data: any) {
    return this.loggers$.pipe(
      take(1),
      switchMap((loggers: any) =>
        this.http.post(environment.APIURL + '/logger', data).pipe(
          map((logger) => {
            if (loggers?.length > 0) {
              this._loggers.next([...loggers, logger]);
            }
            return logger;
          })
        )
      )
    );
  }
  UpdateLogger(data: any) {
    return this.loggers$.pipe(
      take(1),
      switchMap((loggers: any) =>
        this.http.patch(environment.APIURL + `/logger/${data.id}`, data).pipe(
          map((logger) => {
            const index = loggers.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              loggers[index] = data;
              this._loggers.next(loggers as any[]);
            } else {
              this._loggers.next([logger]);

            }
            return logger;
          })
        )
      )
    );
  }
  DeleteLogger(id: string) {
    return this.loggers$.pipe(
      take(1),
      switchMap((loggers: any) =>
        this.http.delete(environment.APIURL + `/logger/${id}`).pipe(
          map((isDelete) => {
            const updateLogger = loggers.filter((e: any) => e.id != id);
            this._loggers.next(updateLogger);
            return isDelete;
          })
        )
      )
    );
  }
}
