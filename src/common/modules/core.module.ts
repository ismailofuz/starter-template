import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { cwd } from 'process';
import configuration from '../options/configuration';
import { KnexOptions } from '../options/knex.options';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        KnexModule.forRootAsync({
            useClass: KnexOptions,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(cwd(), 'assets'),
        }),
        CacheModule.register({ isGlobal: true }),
    ],
})
export class CoreModules {}
