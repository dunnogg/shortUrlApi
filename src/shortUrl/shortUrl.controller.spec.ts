import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { shortUrlModule } from './shortUrl.module';

describe('UrlController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [shortUrlModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('/POST shorten should create a short URL', () => {
        return request(app.getHttpServer())
            .post('/shorten')
            .send({ originalUrl: 'https://example.com' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('shortUrl');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
