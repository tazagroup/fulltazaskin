import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private _banners: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _banner: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get banners$(): Observable<any[] | null> {
    return this._banners.asObservable();
  }
  get banner$(): Observable<any | null> {
    return this._banner.asObservable();
  }
  constructor(private http: HttpClient) { }

  getAllBanners() {
    return this.http.get(environment.APIURL + '/banner').pipe(
      map((data: any) => { 
        this._banners.next(data);
        return data;
      })
    );
  }
  searchBanner(query:any) {
    return this.http.get(environment.APIURL + `/banner/search?query=${query}`).pipe(
      map((data: any) => { 
        return data;
      })
    );
  }
  getBannerBySlug(slug: string) {
    return this.http.get(environment.APIURL + `/banner/findslug/${slug}`).pipe(
      map((data: any) => {
        this._banner.next(data);
        return data;
      })
    );
  }
  getPaginaBanners(page: number, limit: number) {
    const params ={ page: String(page), limit: String(limit) }
    return this.http.get(environment.APIURL+'/banner/pagina',{ params }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getBannerById(id: string) {
    return this.http.get(environment.APIURL + `/banner/findid/${id}`).pipe(
      map((data: any) => {
        this._banner.next(data);
        return data;
      })
    );
  }
  CreateBanner(data: any) {
    return this.banners$.pipe(
      take(1),
      switchMap((banners: any) =>
        this.http.post(environment.APIURL + '/banner', data).pipe(
          map((banner) => {
            if (banners?.length > 0) {
              this._banners.next([...banners, banner]);
            }
            return banner;
          })
        )
      )
    );
  }
  UpdateBanner(data: any) {
    return this.banners$.pipe(
      take(1),
      switchMap((banners: any) =>
        this.http.patch(environment.APIURL + `/banner/${data.id}`, data).pipe(
          map((banner) => {
            const index = banners.findIndex((item: any) => item.id === data.id);
            if (index != -1) {
              banners[index] = data;
              this._banners.next(banners as any[]);
            } else {
              this._banners.next([banner]);

            }
            return banner;
          })
        )
      )
    );
  }
  DeleteBanner(id: string) {
    return this.banners$.pipe(
      take(1),
      switchMap((banners: any) =>
        this.http.delete(environment.APIURL + `/banner/${id}`).pipe(
          map((isDelete) => {
            const updateBanner = banners.filter((e: any) => e.id != id);
            this._banners.next(updateBanner);
            return isDelete;
          })
        )
      )
    );
  }
}
