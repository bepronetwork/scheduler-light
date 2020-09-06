import Logic from "./logic";
import {AppRepository} from "../repos/app";
import { CurrencySchema } from "../schemas/currency";
import { fromPeriodicityToDates } from "./utils/date_settings";
class App extends Logic {

    constructor(queue) {
        super(queue);
    }

    async registerPopularNumber() {
        return new Promise(async (resolve, reject)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                try {
                    const result = await AppRepository.popularNumber(app._id);
                    await AppRepository.insertPopularNumber(app._id, result);
                    resolve(true);
                }catch(err){
                    reject(err);
                }
            }, "registerPopularNumber");
        });
    }

    async registerLastBet() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.lastsBets(app._id.toString());
                await AppRepository.insertLastsBets(app._id.toString(), result);

                for(let game of app.games){
                    const resultGame = await AppRepository.lastsBets(app._id.toString(), game._id.toString());
                    await AppRepository.insertLastsBets(app._id.toString(), resultGame, game);
                }

                resolve(true);
            }, "registerLastBet");
        });
    }
    async registerBiggestBetWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetWinners(app._id, null);
                await AppRepository.insertBiggestBetWinners(app._id, result);
                for(let game of app.games){
                    const resultGame = await AppRepository.biggestBetWinners(app._id.toString(), game._id.toString());
                    await AppRepository.insertBiggestBetWinners(app._id.toString(), resultGame, game);
                }
                resolve(true);
            }, "registerBiggestBetWinner");
        });
    }

    async registerBiggestUserWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetUserWinners(app._id);
                await AppRepository.insertBiggestBetUserWinners(app._id, result);
                resolve(true);
            }, "registerBiggestUserWinner");
        });
    }

    async registerUserStats() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                let currencies = await CurrencySchema.prototype.model.find();
                let periods = [
                    "daily",
                    "weekly"
                ];
                for(let currency of currencies) {
                    for(let period of periods) {
                        const result = await AppRepository.userStats(app._id, currency._id, fromPeriodicityToDates({periodicity: period}) );
                        await AppRepository.insertUserStats(app._id, new String(currency._id).toString(), period, result);
                    }
                }
                resolve(true);
            }, "registerUserStats");
        });
    }

    async registerGameStats() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                let currencies = await CurrencySchema.prototype.model.find();
                let periods = [
                    "daily",
                    "weekly"
                ];
                for(let currency of currencies) {
                    for(let period of periods) {
                        const result = await AppRepository.gameStats(app._id, currency._id, fromPeriodicityToDates({periodicity: period}) );
                        await AppRepository.insertGameStats(app._id, new String(currency._id).toString(), period, result);
                    }
                }
                resolve(true);
            }, "registerGameStats");
        });
    }

}

const AppLogic = new App({
    registerBiggestBetWinner    : false,
    registerBiggestUserWinner   : false,
    registerLastBet             : false,
    registerPopularNumber       : false,
    registerUserStats           : false,
    registerGameStats           : false
});

export {
    AppLogic
}