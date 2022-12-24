import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
    MediaFileAssociations,
    MediaFileUsages,
} from '../../common/types/enums';

export class UploadFileMetadataDto {
    @IsEnum(MediaFileAssociations)
    associated_with: MediaFileAssociations;

    @IsEnum(MediaFileUsages)
    usage: MediaFileUsages;

    @ApiProperty({
        name: 'file',
        type: 'string',
        format: 'binary',
    })
    file: any;
}
