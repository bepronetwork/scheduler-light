import { AppSchema } from "../schemas/app";
import {pipeline_biggest_bet_winners, pipeline_biggest_user_winners, pipeline_last_bets, pipeline_popular_numbers, pipeline_biggest_bet_winners_esports, pipeline_last_bets_esports, pipeline_biggest_user_winners_esports} from "./pipeline"
import { LastBetsSchema } from "../schemas/lastBets";
import { BiggestUserWinnerSchema } from "../schemas/biggestUserWinner";
import { BiggestBetWinnerSchema } from "../schemas/biggestBetWinners";
import { BetSchema } from "../schemas/bet";
import { PopularNumberSchema } from "../schemas/popularNumbers";
import { BetEsportsSchema } from "../schemas/betEsports";
import { LastBetsEsportsSchema } from "../schemas/lastBetsEsports";
import { BiggestBetWinnerEsportsSchema } from "../schemas/biggestBetWinnersEsports";
import { BiggestUserWinnerEsportsSchema } from "../schemas/biggestUserWinnerEsports";


class App {

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

    lastBetsEsports(_id) {
        return new Promise( (resolve, reject) => {
            BetEsportsSchema.prototype.model
            .aggregate(pipeline_last_bets_esports(_id, {size: 50}))
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

    biggestBetUserWinnersEsports(_id) {
        return new Promise( (resolve, reject) => {
            BetEsportsSchema.prototype.model
            .aggregate(pipeline_biggest_user_winners_esports(_id, { offset: 0, size: 200}))
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

    biggestBetWinnersEsports(_id) {
        return new Promise( (resolve, reject) => {
            BetEsportsSchema.prototype.model
            .aggregate(pipeline_biggest_bet_winners_esports(_id, {size: 200}))
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

    insertLastBetsEsports(_id, data) {
        return new Promise( (resolve, reject) => {
            LastBetsEsportsSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app               : _id,
                        timestamp         : new Date(),
                        lastBetsEsports   : data
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

    insertBiggestBetWinnersEsports(_id, data) {
        return new Promise( (resolve, reject) => {
            BiggestBetWinnerEsportsSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app                      : _id,
                        timestamp                : new Date(),
                        biggestBetWinnerEsports  : data
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

    insertBiggestBetUserWinnersEsports(_id, data) {
        return new Promise( (resolve, reject) => {
            BiggestUserWinnerEsportsSchema.prototype.model
            .findOneAndUpdate({app: _id},
                {
                    $set: {
                        app                       : _id,
                        timestamp                 : new Date(),
                        biggestUserWinnerEsports  : data
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