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

    private get users() {
        return this.knex<UserI>('users');
    }

    async create(dto: CreateUser): Promise<UserI> {
        return this.users
            .insert(dto)
            .returning('*')
            .then((rows) => rows[0]);
    }

    findById(id: number): Promise<UserI> {
        return this.users.where({ id }).first();
    }

    find(query: QueryUsers): Promise<UserI[]> {
        return this.users
            .where('name', 'ilike', `%${query.q}%`)
            .orWhere('email', 'ilike', `%${query.q}%`)
            .limit(query.page.limit)
            .offset(query.page.offset);
    }

    async update(id: number, dto: Partial<Omit<UserI, 'id'>>): Promise<UserI> {
        return this.users
            .where({ id })
            .update(dto)
            .returning('*')
            .then((rows) => rows[0]);
    }

    async delete(id: number): Promise<UserI> {
        return this.users
            .where({ id })
            .del()
            .returning('*')
            .then((rows) => rows[0]);
    }
}
