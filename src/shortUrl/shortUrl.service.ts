import {GoneException, Injectable, NotFoundException} from '@nestjs/common';
import Redis from "ioredis";
import {InjectRedis} from "@nestjs-modules/ioredis";
import { nanoid } from 'nanoid';

@Injectable()
export class shortUrlService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async create(originalUrl: string, alias?: string, expiresAt?: Date | string): Promise<{ shortUrl: string }> {
        const shortUrl = alias || nanoid(6);

        const existingUrl = await this.redis.get(shortUrl);
        if (existingUrl) {
            throw new Error('Alias already exists');
        }

        const data = {
            originalUrl,
            createdAt: new Date().toISOString(),
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
            clickCount: 0,
        };

        await this.redis.set(shortUrl, JSON.stringify(data));
        return { shortUrl };
    }


    async redirect(shortUrl: string, ip: string): Promise<string> {
        const urlData = await this.redis.get(shortUrl);
        if (!urlData) throw new NotFoundException('URL not found');

        const data = JSON.parse(urlData);
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
            throw new GoneException('URL expired');
        }

        data.clickCount += 1;
        data.analytics = [...(data.analytics || []), { date: new Date().toISOString(), ip }];
        await this.redis.set(shortUrl, JSON.stringify(data));

        return data.originalUrl;
    }

    async getInfo(shortUrl: string): Promise<any> {
        const urlData = await this.redis.get(shortUrl);
        if (!urlData) throw new NotFoundException('URL not found');

        const data = JSON.parse(urlData);
        delete data.analytics;
        return data;
    }

    async delete(shortUrl: string): Promise<void> {
        const result = await this.redis.del(shortUrl);
        if (result === 0) throw new NotFoundException('URL not found');
    }

    async getAnalytics(shortUrl: string): Promise<{ clickCount: number; lastFiveIps: string[] }> {
        const urlData = await this.redis.get(shortUrl);
        if (!urlData) throw new NotFoundException('URL not found');

        const data = JSON.parse(urlData);
        const lastFiveIps = (data.analytics || []).slice(-5).map((a: any) => a.ip);
        return { clickCount: data.clickCount, lastFiveIps };
    }
}
