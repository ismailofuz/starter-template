import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const config = new DocumentBuilder()
        .setTitle('Template')
        .setDescription('Template API Documentation')
        .addBearerAuth()
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.enableCors();
    await app.listen(configService.get<number>('port'));
}
bootstrap();
