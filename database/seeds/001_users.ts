import { cleanId } from '../clean-id';
import { baseUsers } from '../fakers/users';
import { Knex } from 'knex';

exports.seed = (knex: Knex) => seed(knex);

const clean = cleanId(baseUsers);

function seed(knex: Knex) {
    return knex('users')
        .del()
        .then(() => {
            return knex('users').insert(clean);
        });
}
