import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ){}

  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return null;
   }
      else
      {
        const item = localStorage.getItem(key);
        if (item) {
          return JSON.parse(item);
        }
        return null;
      }
    
  }
  setItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
      }
      else
      {
      localStorage.setItem(key, JSON.stringify(value));
      }
    
  }
  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
      }
      else
      {
       localStorage.removeItem(key);
      }
  }
}

