import Logic from "./logic";
import {AppRepository} from "../repos/app";
class App extends Logic {
    registerLastBet() {
        this.buildLogicRegisterPerSkip(async (app)=>{
            const result = await AppRepository.lastsBets(app);
            await AppRepository.insertLastsBets(app, result);
        });
    }
    registerBiggestUserWinner() {
        this.buildLogicRegisterPerSkip(async (app)=>{
            const result = await AppRepository.biggestBetUserWinners(app);
            await AppRepository.insertBiggestBetUserWinners(app, result);
        });
    }
    registerBiggestBetWinner() {
        this.buildLogicRegisterPerSkip(async (app)=>{
            const result = await AppRepository.biggestBetWinners(app);
            await AppRepository.insertBiggestBetWinners(app, result);
        });
    }
}

const AppLogic = new App();

export {
    AppLogic
}