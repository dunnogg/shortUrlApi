import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: '*',
        }
    });
  const options = new DocumentBuilder()
      .setTitle('Short Url API')
      .setVersion('1')
      .addServer('/', 'Local environment')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
