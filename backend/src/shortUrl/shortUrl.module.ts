import { Module } from '@nestjs/common';
import { shortUrlController } from './shortUrl.controller';
import { shortUrlService } from './shortUrl.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Link} from "./entity/Link.entity";
import {Redirection} from "./entity/Redirection.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([Link, Redirection]),
    ],
    controllers: [shortUrlController],
    providers: [shortUrlService],
})
export class shortUrlModule {}
