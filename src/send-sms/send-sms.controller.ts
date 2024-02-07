import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

@ApiBearerAuth()
@ApiTags('Sms')
@Controller('sms')
export class SmsController {
    constructor(private readonly logger: PinoLogger) {
        this.logger.setContext(SmsController.name);
    }
}
