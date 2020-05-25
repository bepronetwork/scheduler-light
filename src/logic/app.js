import Logic from "./logic";
import {AppRepository} from "../repos/app";
import GoogleStorageSingleton from './third-parties/googleStorage';
import {nameCurrentDate} from './utils/string';
class App extends Logic {

    constructor(queue) {
        super(queue);
    }

    async registerPopularNumber() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                try {
                    const result = await AppRepository.popularNumber(app._id);
                    await AppRepository.insertPopularNumber(app._id, result);
                }catch(err){
                    console.log(err);
                }
            }, "registerPopularNumber");
            resolve(true);
        });
    }

    async registerLastBet() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                try {
                    const result = await AppRepository.lastsBets(app._id.toString());
                    await AppRepository.insertLastsBets(app._id.toString(), result);

                    for(let game of app.games){
                        const resultGame = await AppRepository.lastsBets(app._id.toString(), game._id.toString());
                        await AppRepository.insertLastsBets(app._id.toString(), resultGame, game);
                    }
                } catch(err) {
                    console.log(err);
                }
            }, "registerLastBet");
            resolve(true);
        });
    }
    async registerBiggestBetWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                try {
                    const result = await AppRepository.biggestBetWinners(app._id, null);
                    await AppRepository.insertBiggestBetWinners(app._id, result);
                    for(let game of app.games){
                        const resultGame = await AppRepository.biggestBetWinners(app._id.toString(), game._id.toString());
                        await AppRepository.insertBiggestBetWinners(app._id.toString(), resultGame, game);
                    }
                } catch(err) {
                    console.log(err);
                }
            }, "registerBiggestBetWinner");
            resolve(true);
        });
    }

    async registerBiggestUserWinner() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                try {
                    const result = await AppRepository.biggestBetUserWinners(app._id);
                    await AppRepository.insertBiggestBetUserWinners(app._id, result);
                } catch(err) {
                    console.log(err);
                }
            }, "registerBiggestUserWinner");
            resolve(true);
        });
    }

    async generateBalance() {
        return new Promise(async (resolve)=>{
            await this.buildLogicRegisterPerSkip(async (app)=>{
                const balanceArray = (await AppRepository.getBalance(app._id)) ;
                const result = balanceArray.map((item) => {
                    return [`${item.id}`, `${item.balance} ${item.ticker == undefined ? 'eth' : item.ticker}`];
                });
                if(result.length > 0) {
                    const link = await GoogleStorageSingleton.uploadFile({bucketName : 'balances-clients', file : result, name : `${app.name}-${nameCurrentDate()}-balances`});
                    console.log(link);
                }
            }, "generateBalance");
            resolve(true);
        });
    }
}

const AppLogic = new App({
    'registerBiggestBetWinner'    : false,
    'registerBiggestUserWinner'   : false,
    'registerLastBet'             : false,
    'registerPopularNumber'       : false,
    'generateBalance'             : false
});

export {
    AppLogic
}