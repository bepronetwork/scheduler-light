import { AppLogic } from '../logic/app';

const Agenda = require('agenda');
require('dotenv').config();
const time                          = process.env.TIME;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const agenda = new Agenda({
    db: {
        address: `${MONGO_CONNECTION_STRING}/redis?ssl=true&authSource=admin&retryWrites=true&w=majority`,
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
                AppLogic.registerBiggestUserWinner(),
                AppLogic.registerPopularNumber()
                // AppLogic.registerUserStats(),
                // AppLogic.registerGameStats()
            ]);
        }, 1000 * 60 * time);

        AppLogic.generateBalance().then(async ()=>{
            // await agenda.schedule('sunday at 1:00am', 'sunday');
        });

        agenda.define('sunday', async job => {
            AppLogic.generateBalance().then(async ()=>{
                await agenda.schedule('sunday at 1:00am', 'sunday');
            });
        });

        (async function() {
            await agenda.start();
            await agenda.schedule('sunday at 1:00am', 'sunday');
        })();
    }
}
const AgendaSingleton = new AgendaCore();
export {
    AgendaSingleton
}
