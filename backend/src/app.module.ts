import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {shortUrlModule} from "./shortUrl/shortUrl.module";
import {Link} from "./shortUrl/entity/Link.entity";
import {Redirection} from "./shortUrl/entity/Redirection.entity";

@Module({
    imports: [shortUrlModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgresql',
            port: 5432,
            username: 'postgres',
            password: 'example',
            database: 'postgres',
            entities: [Link, Redirection],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Link, Redirection]),],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
