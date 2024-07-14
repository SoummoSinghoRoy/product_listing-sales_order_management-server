import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn']
  });
  const PORT = 8282
  await app.listen(PORT, () => {
    console.log(`Server connected successfully on port ${PORT}`);
  });
}
bootstrap();
