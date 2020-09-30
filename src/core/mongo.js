import {Mongoose} from 'mongoose';
require('dotenv').config();
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

class database {
    async start() {
        this.connectRedis = new Mongoose();
        this.connectRedis.set('useFindAndModify', false);
        await this.connectRedis.connect(`${MONGO_CONNECTION_STRING}/redis?ssl=true&authSource=admin&retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.connectMain = new Mongoose();
        this.connectMain.set('useFindAndModify', false);
        await this.connectMain.connect(`${MONGO_CONNECTION_STRING}/main?ssl=true&authSource=admin&retryWrites=true&w=majority`, {
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