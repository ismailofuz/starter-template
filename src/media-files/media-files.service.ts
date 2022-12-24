import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as efs from 'fs';
import * as path from 'path';
import { cwd } from 'process';
import { MediaFileStatus } from '../common/types/enums';
import { MediaFilesRepository } from '../repository/classes/media-files';
import { UploadFileMetadataDto } from './dto/upload-file-metadata.dto';

@Injectable()
export class MediaFilesService {
    constructor(private mediaFileMetadataRepository: MediaFilesRepository) {}

    async processFileUpload(
        file: Express.Multer.File,
        uploadFileMetadataDto: UploadFileMetadataDto,
    ) {
        const filename = await this.saveImageToDisk(file);

        const metadata = {
            file_name: file.originalname,
            file_size: file.size,
            file_mimetype: file.mimetype,
            file_path: path.posix.join('assets', 'files', filename),
            associated_with: uploadFileMetadataDto.associated_with,
            usage: uploadFileMetadataDto.usage,
            status: MediaFileStatus.INACTIVE,
            created_at: new Date().toUTCString(),
        };

        await this.mediaFileMetadataRepository.saveMetadata(metadata);

        return {
            path: path.posix.join('files', filename),
        };
    }

    async saveImageToDisk(file: Express.Multer.File): Promise<string> {
        const dir = 'assets/files';
        if (!efs.existsSync(dir)) {
            efs.mkdirSync(dir, { recursive: true });
        }
        const extention = path.extname(file.originalname);
        const filename = randomUUID() + extention;
        await fs.writeFile(
            path.join(cwd(), 'assets', 'files', filename),
            file.buffer,
        );
        return filename;
    }
}
