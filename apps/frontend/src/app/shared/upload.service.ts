import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }
  DeleteuploadDriver(data: any): Observable<any> {
    console.log(data);
    return this.http.delete(environment.APIURL + `/upload/${data.id}`,{ body: data }).pipe(
      map((res: any) => {
        if (res) {
          console.log(res);
          return res;
        }
      })
    );
  }
  uploadDriver(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}_${month}_${year}`;
    return this.http.post(environment.APIURL + `/upload/local?folder=${formattedDate}`, formData).pipe(
      map((data: any) => {
        if (data) {
          return data;
        }
      })
    );
  }
}
