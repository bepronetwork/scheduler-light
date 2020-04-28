import { AppSchema } from "../schemas/app";
import {pipeline_biggest_bet_winners, pipeline_biggest_user_winners, pipeline_last_bets} from "./pipeline"
import { LastBetsSchema } from "../schemas/lastBets";
import { BiggestUserWinnerSchema } from "../schemas/biggestUserWinner";
import { BiggestBetWinnerSchema } from "../schemas/biggestBetWinners";
import { BetSchema } from "../schemas/bet";


class App {

    getAllApps() {
        return new Promise((resolve, reject)=>{
            AppSchema.prototype.model.find()
            .exec((item, err)=>{
                if(err) reject(err);
                resolve(item);
            });
        });
    }

    lastsBets(_id) {
        return new Promise( (resolve, reject) => {
            BetSchema.prototype.model
            .aggregate(pipeline_last_bets(_id, { offset: 0, size: 50}))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    biggestBetUserWinners(_id) {
        return new Promise( (resolve, reject) => {
            AppSchema.prototype.model
            .aggregate(pipeline_biggest_user_winners(_id, { offset: 0, size: 200}))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    biggestBetWinners(_id) {
        return new Promise( (resolve, reject) => {
            AppSchema.prototype.model
            .aggregate(pipeline_biggest_bet_winners(_id, { offset: 0, size: 200}))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    insertLastsBets(_id, data) {
        return new Promise( (resolve, reject) => {
            LastBetsSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app         : _id,
                        timestamp   : new Date(),
                        lastBets    : data
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    insertBiggestBetUserWinners(_id, data) {
        return new Promise( (resolve, reject) => {
            BiggestUserWinnerSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app                 : _id,
                        timestamp           : new Date(),
                        biggestUserWinner   : data
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    insertBiggestBetWinners(_id, data) {
        return new Promise( (resolve, reject) => {
            BiggestBetWinnerSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app                 : _id,
                        timestamp           : new Date(),
                        biggestBetWinner    : data
                    }
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

}
const AppRepository =  new App();

export {
    AppRepository
}