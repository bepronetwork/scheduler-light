import { AppRepository } from '../repos/app';
import { AppSchema } from '../schemas/app';
import { TestSchema } from '../schemas/test';
import { AppLogic } from '../logic/app';

const Agenda = require('agenda');
require('dotenv').config();
const mongoConnection = process.env.MONGO_URL;
const agenda = new Agenda({
    db: {
        address: mongoConnection + "redis?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
        options: {
            useNewUrlParser: true, useUnifiedTopology: true
        },
    },
});
class AgendaCore {

    constructor(){}
    start() {
        agenda.define('test', async job => {
            console.log("Begin");
            await Promise.all([
                AppLogic.registerLastBet(),
                AppLogic.registerBiggestBetWinner(),
                AppLogic.registerBiggestUserWinner()
            ]);
            console.log("End");
        });
        (async function() {
            await agenda.start();
            await agenda.every('10 minutes', 'test');
        })();
    }
}
const AgendaSingleton = new AgendaCore();
export {
    AgendaSingleton
}
