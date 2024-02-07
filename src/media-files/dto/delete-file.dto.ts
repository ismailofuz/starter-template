import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class DeleteFileDto {
    @Type(() => String)
    @IsArray()
    path: string[];
}
