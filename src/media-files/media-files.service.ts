import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import * as efs from 'fs';
import * as path from 'path';
import { cwd } from 'process';
import { MediaFileStatus } from '../common/types/enums';
import { MediaFilesRepository } from '../repository/classes/media-files';
import { UploadFileMetadataDto } from './dto/upload-file-metadata.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import { PinoLogger } from 'nestjs-pino';
import * as sharp from 'sharp';

@Injectable()
export class MediaFilesService {
    constructor(
        private mediaFileMetadataRepository: MediaFilesRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MediaFilesService.name);
    }
    async processFileUpload(
        file: Express.Multer.File,
        uploadFileMetadataDto: UploadFileMetadataDto,
    ) {
        try {
            const filename = await this.saveImageToDisk(
                file,
                uploadFileMetadataDto,
            );

            const metadata = {
                file_name: file.originalname,
                file_size: file.size,
                file_mimetype: file.mimetype,
                file_path: path.posix.join(
                    uploadFileMetadataDto.usage,
                    filename,
                ),
                associated_with: uploadFileMetadataDto.associated_with,
                usage: uploadFileMetadataDto.usage,
                status: MediaFileStatus.INACTIVE,
                created_at: new Date().toUTCString(),
            };

            await this.mediaFileMetadataRepository.saveMetadata(metadata);

            return {
                path: path.posix.join(uploadFileMetadataDto.usage, filename),
            };
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async saveImageToDisk(
        file: Express.Multer.File,
        uploadFileMetadataDto: UploadFileMetadataDto,
    ): Promise<string> {
        try {
            const dir = `assets/files/${uploadFileMetadataDto.usage}`;
            if (!efs.existsSync(dir)) {
                efs.mkdirSync(dir, { recursive: true });
            }
            const extention = path.extname(file.originalname);
            const filename = randomUUID() + extention;
            await fs.writeFile(
                path.join(
                    cwd(),
                    'assets',
                    'files',
                    uploadFileMetadataDto.usage,
                    filename,
                ),
                file.buffer,
            );
            return filename;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    // This method is used to save a base64 image to the disk
    async saveBase64Image(base64String: string): Promise<string> {
        const imageBuffer = Buffer.from(base64String, 'base64');

        // Use sharp to process the image if needed (resize, format conversion, etc.)
        const processedImageBuffer = await sharp(imageBuffer)
            // You can add additional processing options here if needed
            .toBuffer();

        const outputPath = `assets/files/avatar/${randomUUID()}.jpg`;

        // Save the processed image to the specified output path
        efs.writeFileSync(outputPath, processedImageBuffer);

        return outputPath.replace('assets/files/', '');
    }

    deleteFile(dto: DeleteFileDto) {
        return this.mediaFileMetadataRepository.deleteFile(dto);
    }
}
