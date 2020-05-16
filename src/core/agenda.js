import { AppLogic } from '../logic/app';

const Agenda = require('agenda');
require('dotenv').config();
const mongoConnection               = process.env.MONGO_URL;
const time                          = process.env.TIME;
const mongoConnectionDatabaseRedis  = process.env.REDIS;
const agenda = new Agenda({
    db: {
        address: mongoConnection + mongoConnectionDatabaseRedis,
        options: {
            useNewUrlParser: true, useUnifiedTopology: true
        },
    },
});
class AgendaCore {
    start() {
        setInterval(async ()=> {
            console.log("Begin");
            // has a queue control within each logic, that is, even if it calls the logic before it ends it ignores it and only starts again after it leaves the queue
            await Promise.all([
                AppLogic.registerLastBet(),
                AppLogic.registerBiggestBetWinner(),
                AppLogic.registerBiggestUserWinner()
            ]);
        }, 1000 * 60 * time);
    }
}
const AgendaSingleton = new AgendaCore();
export {
    AgendaSingleton
}
