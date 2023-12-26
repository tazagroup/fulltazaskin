import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/frontend/src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class KhachhangdichvuService {
    private _khachhangdichvus: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
    private _khachhangdichvu: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
    get khachhangdichvus$(): Observable<any[] | null> {
        return this._khachhangdichvus.asObservable();
    }
    get khachhangdichvu$(): Observable<any | null> {
        return this._khachhangdichvu.asObservable();
    }
    constructor(private http: HttpClient) { }
    getVttech() {
        return this.http.get(environment.APIURL + '/khachhangdichvu/vttech').pipe(
            map((data: any) => {
                this._khachhangdichvus.next(data);
                return data;
            })
        );
    }
    getAllKhachhangdichvus() {
        return this.http.get(environment.APIURL + '/khachhangdichvu').pipe(
            map((data: any) => {
                this._khachhangdichvus.next(data);
                return data;
            })
        );
    }
    searchKhachhangdichvu(query: any) {
        return this.http.get(environment.APIURL + `/khachhangdichvu/search?query=${query}`).pipe(
            map((data: any) => {
                return data;
            })
        );
    }
    getKhachhangdichvuBySlug(slug: string) {
        return this.http.get(environment.APIURL + `/khachhangdichvu/findslug/${slug}`).pipe(
            map((data: any) => {
                this._khachhangdichvu.next(data);
                return data;
            })
        );
    }
    getPaginaKhachhangdichvus(page: number, perPage: number) {
        const params = { page: String(page), perPage: String(perPage) }
        return this.http.get(environment.APIURL + '/khachhangdichvu/pagination', { params }).pipe(
            map((data: any) => {
                return data;
            })
        );
    }
    getKhachhangdichvuById(id: string) {
        return this.http.get(environment.APIURL + `/khachhangdichvu/findid/${id}`).pipe(
            map((data: any) => {
                this._khachhangdichvu.next(data);
                return data;
            })
        );
    }
    CreateKhachhangdichvu(data: any) {
        return this.khachhangdichvus$.pipe(
            take(1),
            switchMap((khachhangdichvus: any) =>
                this.http.post(environment.APIURL + '/khachhangdichvu', data).pipe(
                    map((khachhangdichvu) => {
                        if (khachhangdichvus?.length > 0) {
                            this._khachhangdichvus.next([...khachhangdichvus, khachhangdichvu]);
                        }
                        return khachhangdichvu;
                    })
                )
            )
        );
    }
    UpdateKhachhangdichvu(data: any) {
        return this.khachhangdichvus$.pipe(
            take(1),
            switchMap((khachhangdichvus: any) =>
                this.http.patch(environment.APIURL + `/khachhangdichvu/${data.id}`, data).pipe(
                    map((khachhangdichvu) => {
                        const index = khachhangdichvus.findIndex((item: any) => item.id === data.id);
                        if (index != -1) {
                            khachhangdichvus[index] = data;
                            this._khachhangdichvus.next(khachhangdichvus as any[]);
                        } else {
                            this._khachhangdichvus.next([khachhangdichvu]);

                        }
                        return khachhangdichvu;
                    })
                )
            )
        );
    }
    DeleteKhachhangdichvu(id: string) {
        return this.khachhangdichvus$.pipe(
            take(1),
            switchMap((khachhangdichvus: any) =>
                this.http.delete(environment.APIURL + `/khachhangdichvu/${id}`).pipe(
                    map((isDelete) => {
                        const updateKhachhangdichvu = khachhangdichvus.filter((e: any) => e.id != id);
                        this._khachhangdichvus.next(updateKhachhangdichvu);
                        return isDelete;
                    })
                )
            )
        );
    }
}
