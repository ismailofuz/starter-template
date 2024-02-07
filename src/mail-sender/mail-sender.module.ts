import { Module } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('mail.host'),
                    port: 587,
                    secure: false,
                    auth: {
                        user: config.get('mail.user'),
                        pass: config.get('mail.password'),
                    },
                },
                defaults: {
                    from: `Smth <${config.get('mail.from')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailSenderService],
})
export class MailSenderModule {}
