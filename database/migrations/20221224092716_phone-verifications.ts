import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    return knex.schema.createTable('verifications', (table) => {
        table
            .uuid('id')
            .unique()
            .notNullable()
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('phone');
        table.integer('code').notNullable();
        table.datetime('expires_at').notNullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.index(['expires_at'], 'verification_idx1', {
            storageEngineIndexType: 'btree',
        });
        table.index(['id', 'code'], 'verification_idx2', {
            storageEngineIndexType: 'hash',
        });
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('verifications');
}
