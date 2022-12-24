import { OffsetPaginationI, UserI } from '../../common/types/interfaces';

export type CreateUser = Omit<UserI, 'id'>;
export type QueryUsers = {
    q?: string;
    page?: OffsetPaginationI;
};
export type QueryAdmins = {
    q?: string;
    page?: OffsetPaginationI;
};
export type UpdateUser = Partial<Omit<UserI, 'id'>>;

export default interface UsersRepositoryInterface {
    create(dto: CreateUser): Promise<UserI>;
    findById(id: number): Promise<UserI>;
    find(query: QueryUsers): Promise<UserI[]>;
    update(id: number, dto: UpdateUser): Promise<UserI>;
    delete(id: number): Promise<UserI>;
}
