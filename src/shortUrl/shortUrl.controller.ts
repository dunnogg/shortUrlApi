import {Body, Controller, Delete, Get, Ip, Param, Post, Res} from '@nestjs/common';
import { Response } from 'express';
import {shortUrlService} from "./shortUrl.service";

@Controller()
export class shortUrlController {
    constructor(private readonly urlService: shortUrlService) {}

    @Post('shorten')
    async create(@Body('originalUrl') originalUrl: string, @Body('alias') alias?: string, @Body('expiresAt') expiresAt?: Date) {
        return this.urlService.create(originalUrl, alias, expiresAt);
    }

    @Get(':shortUrl')
    async redirect(@Param('shortUrl') shortUrl: string, @Ip() ip: string, @Res() res: Response) {
        const originalUrl = await this.urlService.redirect(shortUrl, ip);
        return res.redirect(originalUrl);
    }

    @Get('info/:shortUrl')
    getInfo(@Param('shortUrl') shortUrl: string) {
        return this.urlService.getInfo(shortUrl);
    }

    @Delete('delete/:shortUrl')
    delete(@Param('shortUrl') shortUrl: string) {
        return this.urlService.delete(shortUrl);
    }

    @Get('analytics/:shortUrl')
    getAnalytics(@Param('shortUrl') shortUrl: string) {
        return this.urlService.getAnalytics(shortUrl);
    }
}
