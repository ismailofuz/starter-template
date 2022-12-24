import { Module } from '@nestjs/common';
import { CoreModules } from './common/modules/core.module';

@Module({
    imports: [CoreModules],
})
export class AppModule {}
