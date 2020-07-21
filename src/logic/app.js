import Logic from "./logic";
import {AppRepository} from "../repos/app";
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

    async registerLastBetsEsports() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.lastBetsEsports(app._id.toString());
                await AppRepository.insertLastBetsEsports(app._id.toString(), result);
                resolve(true);
            }, "registerLastBetEsports");
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

    async registerBiggestBetWinnerEsports() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetWinnersEsports(app._id);
                await AppRepository.insertBiggestBetWinnersEsports(app._id, result);
                resolve(true);
            }, "registerBiggestBetWinnerEsports");
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

    async registerBiggestUserWinnerEsports() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetUserWinnersEsports(app._id);
                await AppRepository.insertBiggestBetUserWinnersEsports(app._id, result);
                resolve(true);
            }, "registerBiggestUserWinnerEsports");
        });
    }
}

const AppLogic = new App({
    registerBiggestBetWinner         : false,
    registerBiggestBetWinnerEsports  : false,
    registerBiggestUserWinner        : false,
    registerBiggestUserWinnerEsports : false,
    registerLastBet                  : false,
    registerLastBetsEsports          : false,
    registerPopularNumber            : false
});

export {
    AppLogic
}