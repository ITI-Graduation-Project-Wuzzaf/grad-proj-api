"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .createTable('user_account', (t) => {
            t.increments('id').primary().unique();
            t.string('email', 100).unique().notNullable();
            t.string('password', 100).notNullable();
            t.string('first_name', 100).notNullable();
            t.string('last_name', 100).notNullable();
            t.string('role', 10).defaultTo('user');
        })
            .createTable('profile', (t) => {
            t.integer('id').unsigned().notNullable().primary().references('id').inTable('user_account');
            t.string('job', 100);
            t.string('country', 60);
            t.string('city', 60);
            t.string('university');
            t.enu('gender', ['M', 'F']);
            t.string('experience', 100);
            t.date('birthdate');
            t.text('profile_picture');
            t.text('cv');
            t.text('bio');
            t.specificType('skills', 'varchar(100)[]');
            t.specificType('links', 'text[]');
            t.text('portfolio');
        })
            .createTable('employer', (t) => {
            t.increments('id').primary().unique();
            t.string('email', 100).unique().notNullable();
            t.string('password', 100).notNullable();
            t.string('name', 100).notNullable();
            t.string('country', 60);
            t.string('city', 60);
            t.text('logo');
            t.text('description');
            t.text('website');
            t.string('industry', 100);
            t.integer('size');
            t.boolean('featured').defaultTo(false);
            t.string('role', 10).defaultTo('employer');
            t.timestamps();
        })
            .createTable('job', (t) => {
            t.increments('id').primary().unique();
            t.string('title', 200).notNullable();
            t.text('description').notNullable();
            t.enu('type', ['Part-time', 'Full-time']);
            t.string('location');
            t.integer('min_salary');
            t.integer('max_salary');
            t.string('experience', 100);
            t.enu('category', ['Development', 'Design', 'Marketing', 'Business', 'Support']).notNullable();
            t.specificType('skills', 'varchar(100)[]');
            t.boolean('featured').defaultTo(false);
            t.integer('employer_id').unsigned().notNullable().references('id').inTable('employer');
            t.timestamps(true, true);
        })
            .createTable('application', (t) => {
            t.increments('id').primary().unique();
            t.integer('user_id').unsigned().notNullable().references('id').inTable('user_account');
            t.integer('job_id').unsigned().notNullable().references('id').inTable('job').onDelete('CASCADE');
            t.enu('status', ['submitted', 'rejected', 'in-consideration']).defaultTo('submitted');
            t.text('cv').notNullable();
            t.text('cover_letter');
            t.text('additional_info');
            t.text('feedback');
            t.timestamps(true, true);
            t.unique(['user_id', 'job_id']);
        })
            .createTable('user_saved_job', (t) => {
            t.increments('id').primary();
            t.integer('user_id').unsigned().notNullable().references('id').inTable('user_account');
            t.integer('job_id').unsigned().notNullable().references('id').inTable('job');
            t.unique(['user_id', 'job_id']);
        })
            .createTable('notification', (t) => {
            t.increments('id').primary();
            t.text('content').notNullable();
            t.text('url');
            t.integer('recipient_id').notNullable().unsigned();
            t.string('recipient_type', 20).notNullable();
            t.boolean('is_read').defaultTo(false);
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema
            .dropTable('notification')
            .dropTable('user_saved_job')
            .dropTable('application')
            .dropTable('profile')
            .dropTable('job')
            .dropTable('user_account')
            .dropTable('employer');
    });
}
exports.down = down;
