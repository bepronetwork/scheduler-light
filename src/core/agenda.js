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
        agenda.define('sunday', async job => {
            AppLogic.generateBalance().then(async ()=>{
                await agenda.schedule('sunday at 1:00am', 'sunday');
            });
        });

        agenda.define('minutes', async job => {
            AppLogic.registerLastBet();
            AppLogic.registerBiggestBetWinner();
            AppLogic.registerBiggestUserWinner();
            AppLogic.registerPopularNumber();
        });

        (async function() {
            await agenda.start();
            await agenda.every(`${time} minutes`, 'minutes');
            await agenda.schedule('sunday at 1:00am', 'sunday');
        })();
    }
}
const AgendaSingleton = new AgendaCore();
export {
    AgendaSingleton
}
