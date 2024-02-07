import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MessageProducerService {
    constructor(@InjectQueue('message-queue') private queue: Queue) {}

    async sendMessage(phone: string, email: string, first_name: string) {
        await this.queue.add(
            'message-job',
            {
                phone: phone,
                email: email,
                first_name: first_name,
            },
            { delay: 10000 },
        );
    }
}
