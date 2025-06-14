import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './utils/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableCors({
    origin: ['http://localhost:3000', 'https://wallet-web-six.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })

  const config = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('API para gerenciamento de finanças pessoais')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
