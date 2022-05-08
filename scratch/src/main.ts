import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// standard function name
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3333); // reserve 3000 for frontend
}

bootstrap();
