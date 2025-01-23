import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {shortUrlModule} from "./shortUrl/shortUrl.module";

@Module({
  imports: [shortUrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
