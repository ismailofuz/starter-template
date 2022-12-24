import { Transform } from 'class-transformer';
import { IsInt, ValidateIf } from 'class-validator';

export class OffsetPaginationDto {
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    limit: number;

    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @ValidateIf((o) => o.offset !== 0)
    offset: number;
}

export const offsetDefault = new OffsetPaginationDto();
offsetDefault.offset = 0;
offsetDefault.limit = 10;
