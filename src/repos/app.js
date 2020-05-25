import { AppSchema } from "../schemas/app";
import {pipeline_biggest_bet_winners, pipeline_biggest_user_winners, pipeline_last_bets, pipeline_popular_numbers, pipeline_balance} from "./pipeline"
import { LastBetsSchema } from "../schemas/lastBets";
import { BiggestUserWinnerSchema } from "../schemas/biggestUserWinner";
import { BiggestBetWinnerSchema } from "../schemas/biggestBetWinners";
import { BetSchema } from "../schemas/bet";
import { PopularNumberSchema } from "../schemas/popularNumbers";
import { BalanceWeekSchema } from "../schemas/balanceWeek";


class App {
    getBalance(_id) {
        return new Promise( (resolve, reject) => {
            AppSchema.prototype.model
            .aggregate(pipeline_balance(_id))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    lastsBets(_id, game) {
        return new Promise( (resolve, reject) => {
            BetSchema.prototype.model
            .aggregate(pipeline_last_bets(_id, game, { offset: 0, size: 50}))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    popularNumber(_id) {
        return new Promise( (resolve, reject) => {
            AppSchema.prototype.model
            .aggregate(pipeline_popular_numbers(_id))
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

    biggestBetWinners(_id, game) {
        return new Promise( (resolve, reject) => {
            AppSchema.prototype.model
            .aggregate(pipeline_biggest_bet_winners(_id, game, { offset: 0, size: 200}))
            .exec( (err, item) => {
                if(err) { reject(err)}
                resolve(item);
            });
        });
    }

    insertPopularNumber(_id, data) {
        return new Promise( (resolve, reject) => {
            //To Do
            PopularNumberSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app                 : _id,
                        timestamp           : new Date(),
                        popularNumbers      : data
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

    insertLastsBets(_id, data, game) {
        return new Promise( (resolve, reject) => {
            LastBetsSchema.prototype.model
            .findOneAndUpdate({app: _id, game},
                {
                    $set: {
                        app         : _id,
                        game,
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

    insertBiggestBetWinners(_id, data, game=null) {
        return new Promise( (resolve, reject) => {
            BiggestBetWinnerSchema.prototype.model
            .findOneAndUpdate({app: _id, game},
                {
                    $set: {
                        app                 : _id,
                        game,
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

}
const AppRepository =  new App();

export {
    AppRepository
}