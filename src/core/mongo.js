import {Mongoose} from 'mongoose';
require('dotenv').config();
const mongoConnectionString = process.env.MONGO_URL;
const mongoConnectionDatabaseRedis = process.env.REDIS;
const mongoConnectionDatabaseMain = process.env.MAIN;

class database {
    async start() {
        this.connectRedis = new Mongoose();
        // this.connectRedis.set('useFindAndModify', false);
        await this.connectRedis.connect(mongoConnectionString + mongoConnectionDatabaseRedis, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.connectMain = new Mongoose();
        // this.connectMain.set('useFindAndModify', false);
        await this.connectMain.connect(mongoConnectionString + mongoConnectionDatabaseMain, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return true;
    }

    getConnectRedis() {
        return this.connectRedis;
    }

    getConnectMain() {
        return this.connectMain;
    }
}

const DatabaseSingleton = new database();

export {
    DatabaseSingleton
}