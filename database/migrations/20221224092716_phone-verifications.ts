import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('verifications', (table) => {
        table.integer('user_id');
        table.integer('code').notNullable();
        table.datetime('expires_at').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('verifications');
}
