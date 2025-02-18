import {Body, Controller, Delete, Get, Ip, Param, Post, Req, Res} from '@nestjs/common';
import { Response } from 'express';
import {shortUrlService} from "./shortUrl.service";

@Controller()
export class shortUrlController {
    constructor(private readonly urlService: shortUrlService) {}

    @Post('shorten')
    async create(@Body('originalUrl') originalUrl: string, @Body('alias') alias?: string, @Body('expiresAt') expiresAt?: Number) {
        return this.urlService.create(originalUrl, alias, expiresAt);
    }

    @Get(':shortUrl')
    async redirect(@Param('shortUrl') shortUrl: string, @Req() req: Request, @Res() res: Response) {
        const userIp = req.headers['x-forwarded-for'];

        const originalUrl = await this.urlService.redirect(shortUrl, String(userIp));
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
