import Logic from "./logic";
import {AppRepository} from "../repos/app";
class App extends Logic {

    constructor(queue) {
        super(queue);
    }

    async registerLastBet() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.lastsBets(app);
                await AppRepository.insertLastsBets(app, result);
                resolve(true);
            }, "registerLastBet");
        });
    }
    async registerBiggestUserWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetUserWinners(app);
                await AppRepository.insertBiggestBetUserWinners(app, result);
                resolve(true);
            }, "registerBiggestUserWinner");
        });
    }
    async registerBiggestBetWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const result = await AppRepository.biggestBetWinners(app);
                await AppRepository.insertBiggestBetWinners(app, result);
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