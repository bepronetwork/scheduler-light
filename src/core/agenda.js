const Agenda = require('agenda');
require('dotenv').config();
const mongoConnection = process.env.MONGO_URL;
const agenda = new Agenda({db: {address: mongoConnection}});
class AgendaCore {

    constructor(){}
    start() {
        agenda.define('test', async job => {
        });
        (async function() {
            await agenda.start();
            await agenda.every('1 minute', 'test');
        })();
    }
}
const AgendaSingleton = new AgendaCore();
export {
    AgendaSingleton
}
