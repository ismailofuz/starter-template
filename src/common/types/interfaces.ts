import {
    MediaFileAssociations,
    MediaFileStatus,
    MediaFileUsages,
    Role,
} from './enums';

export interface UserI {
    id: number;
    full_name: string;
    phone: string;
    password: string;
    birth_date: string;
    avatar: string | null;
    role: Role;
    chat_id: string | null;
    created_at: string;
}

export interface VerificationI {
    user_id: number;
    code: number;
    expires_at: string;
}

export interface MediaFileMetadataI {
    id: number;
    file_name: string;
    file_size: number;
    file_mimetype: string;
    file_path: string;
    associated_with: MediaFileAssociations;
    usage: MediaFileUsages;
    status: MediaFileStatus;
    created_at: string;
}

export interface CursorPaginationI {
    first?: number;
    after?: number;
    last?: number;
    before?: number;
}

export interface OffsetPaginationI {
    offset: number;
    limit: number;
}
