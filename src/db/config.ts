
export const mainDB = {
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
    connectionLimit: 10,
    supportBigNumbers: true,
    bigNumberStrings: true,
    idleTimeout: 60000,
    acquireTimeout: 5000
};