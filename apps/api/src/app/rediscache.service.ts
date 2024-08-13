import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
@Injectable()
export class RediscacheService {
  private redis: Redis;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.redis = new Redis('/home/tazaspac/redis/redis.sock');
  }
  async getDataWithCache(key: string,data:any): Promise<any> {
    const cachedData = await this.redis.get(key);
    console.error(cachedData);
    if (cachedData) {
      return cachedData;
    }
    else
    {
      await this.redis.set(key, data,'EX', 60*5); // Cache for 60 seconds
      return data;
    }

  }
  async set(key: string, value: string, expiration: number) {
    await this.redis.set(key, value, 'EX', expiration);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }
}
