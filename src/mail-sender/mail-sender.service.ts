import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateMailSenderDto } from './dto/create-mail-sender.dto';

@Injectable()
export class MailSenderService {
    constructor(private mailerService: MailerService) {}

    async sendEmail(user: CreateMailSenderDto, code: number) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Tasdiqlash',
            template: 'confirmation',
            context: {
                name: user.first_name,
                code: code,
            },
        });
    }

    async signUp(user: CreateMailSenderDto) {
        const code = Math.floor(100000 + Math.random() * 900000);
        await this.sendEmail(user, code);
    }
}
