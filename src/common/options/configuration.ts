export interface DatabaseConfigI {
    type: string;
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
}

export interface JwtI {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}

export enum NodeEnv {
    PROD = 'production',
    TEST = 'test',
    DEV = 'development',
}

export interface ConfigI {
    env: NodeEnv;
    port: number;
    database: DatabaseConfigI;
    jwt: JwtI;
}

export default (): ConfigI => ({
    env: process.env.NODE_ENV as NodeEnv,
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
});
