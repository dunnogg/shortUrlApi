import { Module } from '@nestjs/common';
import { shortUrlController } from './shortUrl.controller';
import { shortUrlService } from './shortUrl.service';
import {RedisModule} from "@nestjs-modules/ioredis";
@Module({
    imports: [ RedisModule.forRootAsync({
        useFactory: () => ({
            type: 'single',
            url: "redis://default:SZ76Or7Qw50Vhu7PVi95b5eqDfbFmtCM@redis-15736.c13.us-east-1-3.ec2.redns.redis-cloud.com:15736",
        }),
    }),
    ],
    controllers: [shortUrlController],
    providers: [shortUrlService],
})
export class shortUrlModule {}
