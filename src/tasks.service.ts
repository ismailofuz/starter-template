import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createHmac } from 'node:crypto';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TasksService {
    private readonly NODE_ENV;
    private readonly DB_NAME;
    private readonly DB_USER;
    private readonly DB_HOST;
    private readonly DB_PASSWORD;
    private readonly ROOT_PASSWORD;

    constructor(
        @InjectKnex() private knex: Knex,
        private config: ConfigService,
    ) {
        this.NODE_ENV = config.get('NODE_ENV');
        this.DB_NAME = config.get('database.name');
        this.DB_USER = config.get('database.user');
        this.DB_HOST = config.get('database.host');
        this.DB_PASSWORD = config.get('database.password');
        this.ROOT_PASSWORD = config.get('ROOT_PASSWORD');
    }

    private isProductionBackupDB = (filePath: string): string => {
        if (this.NODE_ENV == 'production') {
            return `echo '${this.ROOT_PASSWORD}' | sudo -S  docker exec -t admission-postgres pg_dump -c -U ${this.DB_USER} -d ${this.DB_NAME} > ${filePath}`;
        } else {
            return `export PGPASSWORD=${this.DB_PASSWORD}; pg_dump -U ${this.DB_USER} -h ${this.DB_HOST} ${this.DB_NAME} > ${filePath}`;
        }
    };

    private isProductionRestoreDB = (
        dir: string,
        lastBackup: string,
    ): string => {
        if (this.NODE_ENV == 'development') {
            return `echo '${this.ROOT_PASSWORD}' | sudo -S cat ${path.join(
                dir,
                lastBackup,
            )} | sudo -S docker exec -i admission-postgres psql -U ${
                this.DB_NAME
            }`;
        } else {
            return `echo '${this.ROOT_PASSWORD}' | sudo -S cat ${path.join(
                dir,
                lastBackup,
            )} | sudo -S psql -U ${this.DB_USER} -d ${this.DB_NAME}`;
        }
    };

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async backup_db() {
        const package_name = this.hashing('db');
        const dir = 'assets/files/backup/' + package_name;
        const date = Date.now();
        const file_name = `backup_db_${date}.sql`;
        const filePath = `${dir}/${file_name}`;
        await this.deleteBackups(dir);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        exec(this.isProductionBackupDB(filePath), async (err) => {
            if (err) {
                throw new BadRequestException(err.message);
            }

            //  TODO: success
        });
    }

    async restore_db() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;
        try {
            const dir = path.join(__dirname, '..', 'backup/db');
            fs.readdir(
                dir,
                async function (err: any, fileNames: Array<string>) {
                    if (err) {
                        throw new InternalServerErrorException(err.message);
                    }

                    const lastBackup = fileNames[fileNames.length - 1];

                    exec(
                        _this.isProductionRestoreDB(dir, lastBackup),
                        (err) => {
                            if (err) {
                                throw new InternalServerErrorException(
                                    err.message,
                                );
                            }
                        },
                    );
                },
            );

            return {
                status: 200,
                message: 'DB restored successfully!',
            };
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    // async zipFiles() {
    //     await this.deleteFiles(false);
    //     const filePath = `assets/files/backup/` + this.hashing('zip');
    //     const fileName = 'assets_' + Date.now() + '.zip';
    //     fs.mkdirSync(filePath, { recursive: true });

    //     const pathToZip = path.join(__dirname, '..', filePath, fileName);

    //     // const zip = new AdmZip();
    //     // zip.addLocalFolder(path.join(__dirname, '..', 'assets'));
    //     // zip.writeZip(pathToZip);
    // }

    hashing(file_name: string) {
        const secret = 'package_secret_name';
        return createHmac('sha256', secret).update(file_name).digest('hex');
    }

    // async deleteFiles(isUnzip: boolean) {
    //     if (isUnzip === true) {
    //         const filePath = `backup/zip/reset`;
    //         fs.mkdirSync(filePath, { recursive: true });
    //         for (const file of await fs.promises.readdir(
    //             path.join(__dirname, '..', filePath),
    //         )) {
    //             await fs.promises.unlink(
    //                 path.join(__dirname, '..', filePath, file),
    //             );
    //         }
    //     } else {
    //         const filePath = `assets/files/backup/` + this.hashing('zip');

    //         fs.mkdirSync(filePath, { recursive: true });
    //         for (const file of await fs.promises.readdir(
    //             path.join(__dirname, '..', filePath),
    //         )) {
    //             await fs.promises.unlink(
    //                 path.join(__dirname, '..', filePath, file),
    //             );
    //         }
    //     }
    // }

    async deleteBackups(filePath: string) {
        fs.mkdirSync(filePath, { recursive: true });
        for (const file of await fs.promises.readdir(
            path.join(__dirname, '..', filePath),
        )) {
            await fs.promises.unlink(
                path.join(__dirname, '..', filePath, file),
            );
        }
    }

    // async unzipFiles(file_name: string) {
    //     const pathName = `assets/files/backup/` + this.hashing('zip');
    //     const fileName = 'assets';

    //     const filePath = path.join(__dirname, '..', pathName, fileName);

    //     const zip = new AdmZip(filePath);
    //     fs.mkdirSync('assets', { recursive: true });
    //     zip.extractAllTo(path.join(__dirname, '..', 'assets'), true);
    // }
}
