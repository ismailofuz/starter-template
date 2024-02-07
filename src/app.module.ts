import { Module } from '@nestjs/common';
import { CoreModules } from './common/modules/core.module';
import { MediaFilesModule } from './media-files/media-files.module';
import { AuthModule } from './auth/auth.module';
import { SendSmsModule } from './send-sms/send-sms.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';

@Module({
    imports: [
        CoreModules,
        MediaFilesModule,
        AuthModule,
        SendSmsModule,
        MailSenderModule,
    ],
})
export class AppModule {}
