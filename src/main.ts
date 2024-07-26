import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { DatabaseModule } from './database/database.module';

async function bootstrap() {
  const PORT = 8282;
  // const app = await NestFactory.create(AppModule, {
  //   logger: ['error', 'warn']
  // });
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(DatabaseModule), {fallbackOnErrors: true})
  app.setGlobalPrefix('/api');
  app.enableCors();
  await app.listen(PORT, () => {
    console.log(`Server connected successfully on port ${PORT}`);
  });
}
bootstrap();
