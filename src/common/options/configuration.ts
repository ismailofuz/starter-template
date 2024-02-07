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

export interface ThrottleConfigI {
    ttl: number;
    limit: number;
}

export interface MailConfigI {
    host: string;
    user: string;
    password: string;
    from: string;
}

export interface RedisConfigI {
    host: string;
    port: number;
    password: string;
    username?: string;
}

export interface SMSConfigI {
    nickname: string;
    login_url: string;
    email: string;
    password: string;
    verify_sms: string;
    not_filled_profile: string;
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
    sms: SMSConfigI;
    redis: RedisConfigI;
    mail: MailConfigI;
    throttle: ThrottleConfigI;
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
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USER,
    },
    mail: {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        from: process.env.MAIL_FROM,
    },
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL, 10),
        limit: parseInt(process.env.THROTTLE_LIMIT, 10),
    },
    sms: {
        nickname: process.env.SMS_NICKNAME,
        login_url: process.env.SMS_LOGIN_URL,
        email: process.env.SMS_EMAIL,
        password: process.env.SMS_PASSWORD,
        verify_sms: process.env.VERIFY_SMS,
        not_filled_profile: process.env.NOT_FILLED_PROFILE,
    },
});
