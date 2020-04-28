import Logic from "./logic";
import {AppRepository} from "../repos/app";
class App extends Logic {

    constructor(queue) {
        super(queue);
    }

    async registerLastBet() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.lastsBets(app._id, null);
                await AppRepository.insertLastsBets(app._id, result);

                for(let game of app.games){
                    const resultGame = await AppRepository.lastsBets(app, game);
                    await AppRepository.insertLastsBets(app, resultGame);
                }

                resolve(true);
            }, "registerLastBet");
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
    async registerBiggestBetWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetWinners(app._id);
                await AppRepository.insertBiggestBetWinners(app._id, result);
                resolve(true);
            }, "registerBiggestBetWinner");
        });
    }
}

const AppLogic = new App({
    registerBiggestBetWinner    : false,
    registerBiggestUserWinner   : false,
    buildLogicRegisterPerSkip   : false
});

export {
    AppLogic
}