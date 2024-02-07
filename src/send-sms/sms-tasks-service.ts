import { Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectKnex, Knex } from 'nestjs-knex';
import { VerificationI } from 'src/common/types/interfaces';
import { SendSmsService } from './send-sms.service';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis/dist';

export class SmsTasksService implements OnModuleInit {
    private logger = new Logger(SmsTasksService.name);

    constructor(
        @InjectRedis() private readonly redis: Redis,
        @InjectKnex() private knex: Knex,
        private smsService: SendSmsService,
    ) {}

    async onModuleInit() {
        try {
            await this.refreshSmsAuthToken();
            await this.clearOldVerifications();
        } catch (error) {}
    }

    /**
     * at 00:00 (midnight) every 29 days
     */
    @Cron('0 0 */29 * *')
    async refreshSmsAuthToken() {
        try {
            this.logger.log('Refreshing sms auth token');

            const token = await (await this.smsService.generate_token()).token;

            await this.redis.set('smsToken', token, 'EX', 30 * 24 * 60 * 60);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @Cron(CronExpression.EVERY_QUARTER)
    async clearOldVerifications() {
        try {
            const count = await this.knex<VerificationI>('verifications')
                .where('expires_at', '<', new Date().toISOString())
                .del();

            this.logger.log(`Deleted ${count} old verifications`);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
