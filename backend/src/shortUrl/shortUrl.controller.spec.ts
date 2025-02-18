import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { shortUrlController } from './shortUrl.controller';
import { shortUrlService } from './shortUrl.service';

describe('shortUrlController (redirect)', () => {
    let app: INestApplication;
    let urlService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [shortUrlController],
            providers: [
                {
                    provide: shortUrlService,
                    useValue: {
                        redirect: jest.fn().mockResolvedValue('https://youtube.com'), // Мокаем сервис
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        urlService = module.get<shortUrlService>(shortUrlService);
    });

    it('GET /:shortUrl should redirect to original URL', async () => {
        const shortUrl = 'abcd123';

        const response = await request(app.getHttpServer())
            .get(`/${shortUrl}`)
            .expect(302);

        expect(response.header.location).toBe('https://youtube.com');
        expect(urlService.redirect).toHaveBeenCalledWith(shortUrl, expect.any(String));
    });

    afterAll(async () => {
        await app.close();
    });
});
