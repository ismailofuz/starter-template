import { Module } from '@nestjs/common';
import { MediaFilesRepository } from '../repository/classes/media-files';
import { ImagesController } from './images/images.controller';
import { MediaFilesService } from './media-files.service';

@Module({
    controllers: [ImagesController],
    providers: [MediaFilesService, MediaFilesRepository],
})
export class MediaFilesModule {}
