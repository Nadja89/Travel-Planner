import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Povezivanje RabbitMQ mikroservisa
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false, // Poruke nestaju nakon restartovanja brokera 
      },
    },
  });

  // Pokretanje mikroservisa
  await app.startAllMicroservices();
  
  // Pokretanje HTTP servera na portu 3000
  await app.listen(3000);
}
bootstrap();