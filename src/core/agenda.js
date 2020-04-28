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
        agenda.define('time', async job => {
            console.log("Begin");
            // AppLogic.registerLastBet();
            // await AppLogic.registerBiggestBetWinner();
            // await AppLogic.registerBiggestUserWinner();
            console.log("End");
        });
        (async function() {
            await agenda.start();
            await agenda.every(`${time} minutes`, 'time');
        })();
    }
}
const AgendaSingleton = new AgendaCore();
export {
    AgendaSingleton
}
