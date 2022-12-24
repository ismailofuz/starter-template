import {
    Body,
    Controller,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadFileMetadataDto } from '../dto/upload-file-metadata.dto';
import { MediaFilesService } from '../media-files.service';
import { FileTypesValidation } from '../pipes/file-types-validation';

@ApiTags('Media Images')
@ApiBearerAuth()
@Controller('images')
export class ImagesController {
    constructor(private mediaFilesService: MediaFilesService) {}

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    upload(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1_500_000 }),
                    new FileTypesValidation({
                        types: ['image/jpeg', 'image/png', 'image/webp'],
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Body() uploadMediaFileMetadata: UploadFileMetadataDto,
    ) {
        return this.mediaFilesService.processFileUpload(
            file,
            uploadMediaFileMetadata,
        );
    }
}
