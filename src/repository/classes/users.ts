import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { UserI } from '../../common/types/interfaces';
import UsersRepositoryInterface, {
    CreateUser,
    QueryUsers,
} from '../interfaces/users';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
    constructor(@InjectKnex() private readonly knex: Knex) {}
    create(dto: CreateUser): Promise<UserI> {
        throw new Error('Method not implemented.');
    }
    findById(id: number): Promise<UserI> {
        throw new Error('Method not implemented.');
    }
    find(query: QueryUsers): Promise<UserI[]> {
        throw new Error('Method not implemented.');
    }
    update(id: number, dto: Partial<Omit<UserI, 'id'>>): Promise<UserI> {
        throw new Error('Method not implemented.');
    }
    delete(id: number): Promise<UserI> {
        throw new Error('Method not implemented.');
    }

    private get users() {
        return this.knex<UserI>('users');
    }
}
