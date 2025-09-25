import {DataSource, EntitySchema, MixedList} from "typeorm";

export const createAppDataSource = (entities: MixedList<string | Function | EntitySchema<any>> | undefined) => new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities,
    synchronize: true,
    logging: false,
})