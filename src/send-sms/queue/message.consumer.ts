import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendSmsService } from '../send-sms.service';

@Processor('message-queue')
export class MessageConsumer {
    constructor(private readonly sendSms: SendSmsService) {}
    @Process('message-job')
    async readOperationJob(
        job: Job<{ phone: string; email: string; first_name: string }>,
    ) {
        await this.sendSms.sendSms(
            job.data.phone,
            job.data.email,
            job.data.first_name,
        );
    }
}
