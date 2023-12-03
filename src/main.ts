import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views/page'));
  hbs.registerPartials(join(__dirname, '..', 'views/layout'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  
  app.setViewEngine('hbs');

  await app.listen(3400);
}
bootstrap();
