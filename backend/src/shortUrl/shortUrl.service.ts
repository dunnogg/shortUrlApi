import {GoneException, Injectable, NotFoundException} from '@nestjs/common';
import {nanoid} from 'nanoid';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {Link} from "./entity/Link.entity";
import {Redirection} from "./entity/Redirection.entity";
import * as url from "url";

@Injectable()
export class shortUrlService {
    constructor(
        @InjectRepository(Link)
        private linkRepository: Repository<Link>,
        @InjectRepository(Redirection)
        private redirectionRepository: Repository<Redirection>
    ) {
    }

    async create(originalUrl: string, alias?: string, expiresAt?: Number | string): Promise<{ shortUrl: string }> {
        const shortUrl = alias;

        const existingUrl = await this.linkRepository.findOne({where: {alias: shortUrl}})

        if (existingUrl) {
            throw new Error('Alias already exists');
        }

        if (!originalUrl) {
            throw new Error('Original URL is required');
        }

        const data = {
            originalUrl: originalUrl,
            expiresAt: expiresAt ? Number(expiresAt) * 1000 : 0,
            clickCount: 0,
            alias: shortUrl
        };

        await this.linkRepository.save(data);
        return {shortUrl};
    }


    async redirect(shortUrl: string, ip: string): Promise<string> {
        const urlData = await this.linkRepository.findOne({where: {alias: shortUrl}});
        if (!urlData) throw new NotFoundException('URL not found');

        if (Number(urlData.expiresAt) !== 0 && (urlData.expiresAt && (new Date(Number(urlData.expiresAt)) < new Date()))) {
            throw new GoneException('URL expired');
        }
        urlData.clickCount += 1;
        await Promise.all([
            this.redirectionRepository.save({
                ip: ip,
                date: (Date.now() * 1000),
                link: urlData
            }),
            this.linkRepository.save(urlData)
        ]);
        return urlData.originalUrl;
    }

    async getAnalytics(shortUrl: string): Promise<Redirection[]> {
        const link = await this.linkRepository.findOne({
            where: {alias: shortUrl}
        });

        if (!link) throw new NotFoundException('URL not found');

        return await this.redirectionRepository.find({
            where: {link: link},
            order: {date: 'DESC'},
            take: 5
        });
    }


    async delete(shortUrl: string): Promise<void> {
        const result = await this.linkRepository.delete({alias: shortUrl})
        if (!result) throw new NotFoundException('URL not found');
    }

    async getInfo(shortUrl: string): Promise<Link> {
        const urlData = await this.linkRepository.findOne({where: {alias: shortUrl}});
        if (!urlData) throw new NotFoundException('URL not found');
        return urlData
    }
}
