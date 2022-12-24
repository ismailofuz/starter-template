import { MediaFileMetadataI } from '../../common/types/interfaces';

export type CreateMediaFileMetadata = Omit<MediaFileMetadataI, 'id'>;

export default interface MediaFilesRepositoryInterface {
    saveMetadata(payload: CreateMediaFileMetadata): Promise<number>;
    disableOldMediaFile(path: string): Promise<void>;
    confirmNewMediaFile(path: string): Promise<void>;
}
