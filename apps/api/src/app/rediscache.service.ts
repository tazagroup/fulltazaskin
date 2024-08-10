import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class RediscacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getDataWithCache(key: string,data:any): Promise<any> {
    const cachedData = await this.cacheManager.get(key);
    if (cachedData) {
      return cachedData;
    }
    else
    {
      await this.cacheManager.set(key, data, 60*5); // Cache for 60 seconds
      return data;
    }

  }

  private async fetchDataFromDataSource(): Promise<any> {
    // Replace with your actual data fetching logic
    return { data: 'fetched from data source' };
  }
}
