import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('media_file_metadata', (table) => {
        table.increments('id');
        table.string('file_name', 100).notNullable();
        table.integer('file_size').notNullable();
        table.string('file_mimetype', 15).notNullable();
        table.string('file_path', 100).notNullable();
        table.string('associated_with', 10).notNullable();
        table.string('usage', 10).notNullable();
        table.enum('status', ['active', 'inactive']);
        table.date('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('media_file_metadata');
}
