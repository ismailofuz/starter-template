import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectKnex, Knex } from 'nestjs-knex';
import configuration from '../common/options/configuration';
import { VerificationI } from 'src/common/types/interfaces';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis/dist';
import { MailSenderService } from '../mail-sender/mail-sender.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SendSmsService {
    constructor(
        private readonly config: ConfigService,
        private readonly httpService: HttpService,
        @InjectKnex() private readonly knex: Knex,
        @InjectRedis() private readonly redis: Redis,
        private readonly mailerService: MailSenderService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(SendSmsService.name);
    }

    async generate_token() {
        try {
            const data = await this.httpService.axiosRef.post(
                this.config.get('sms.login_url'),
                {
                    email: this.config.get('sms.email'),
                    password: this.config.get('sms.password'),
                },
            );
            const token = data.data['data']['token'];
            if (token) {
                return {
                    token,
                };
            }
            return {
                status: false,
                message: 'Wrong creadentials or any other error!',
            };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async send_sms(token: string, message: string, phone: string) {
        try {
            await this.httpService.axiosRef.post(
                this.config.get('SMS_SEND_URL'),
                {
                    mobile_phone: phone,
                    message: message,
                    from: `${configuration().sms.nickname}`,
                    callback_url: 'http://0000.uz/test.php',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async signUpMailer(email: string, code: number, first_name: string) {
        await this.mailerService.sendEmail({ email, first_name }, code);
    }

    async sendSmsV2(phone: string, code: number) {
        let token = await this.redis.get('smsToken');
        if (!token) {
            token = (await this.generate_token()).token;
        }
        if (phone.startsWith('+')) {
            return await this.send_sms(
                token,
                `${configuration().sms.verify_sms} ${code}`,
                phone.substring(1),
            );
        } else {
            return await this.send_sms(
                token,
                `${configuration().sms.verify_sms} ${code}`,
                phone,
            );
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendSms(phone: string, email: string, first_name: string) {
        const code = Math.floor(100000 + Math.random() * 900000);
        const sms = await this.knex<VerificationI>('verifications')
            .insert({
                code,
                phone: phone,
                expires_at: new Date(Date.now() + 300000),
            })
            .returning('*');
        // if (email) {
        //     await this.signUpMailer(email, code, first_name);
        // }
        let token = await this.redis.get('smsToken');

        if (!token) {
            token = (await this.generate_token()).token;
        }

        if (phone.startsWith('+')) {
            await this.send_sms(
                token,
                `${configuration().sms.verify_sms} ${code}`,
                phone.substring(1),
            );
        } else {
            await this.send_sms(
                token,
                `${configuration().sms.verify_sms} ${code}`,
                phone,
            );
        }
        return { id: sms[0].id }; // TODO bu yerdan codeni olib tashlash esdan chiqmasin
    }
}
