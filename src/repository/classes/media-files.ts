import { InjectKnex, Knex } from 'nestjs-knex';
import * as path from 'path';
import * as fs from 'fs';
import { MediaFileStatus } from '../../common/types/enums';
import { MediaFileMetadataI } from '../../common/types/interfaces';
import MediaFilesRepositoryInterface, {
    CreateMediaFileMetadata,
} from '../interfaces/media-files';
import { DeleteFileDto } from 'src/media-files/dto/delete-file.dto';

export class MediaFilesRepository implements MediaFilesRepositoryInterface {
    constructor(@InjectKnex() private readonly knex: Knex) {}

    private get mediaFileMetadata() {
        return this.knex<MediaFileMetadataI>('media_file_metadata');
    }

    disableOldMediaFile(serve_path: string): Promise<void> {
        return this.mediaFileMetadata
            .where('file_path', '=', path.posix.join('assets', serve_path))
            .update({ status: MediaFileStatus.INACTIVE })
            .returning('id');
    }

    confirmNewMediaFile(serve_path: string): Promise<void> {
        return this.mediaFileMetadata
            .where('file_path', '=', path.posix.join('assets', serve_path))
            .update({ status: MediaFileStatus.ACTIVE })
            .returning('id');
    }

    async saveMetadata(payload: CreateMediaFileMetadata): Promise<number> {
        const metadata = await this.mediaFileMetadata
            .insert(payload)
            .returning(['id']);

        return metadata[0].id;
    }

    async deleteFile(dto: DeleteFileDto) {
        await this.mediaFileMetadata.where('file_path', dto.path).del();
        return dto.path.map((m) =>
            fs.unlink(m, (err) => {
                if (err) return err;
            }),
        );
    }
}
