import mongoose from 'mongoose';
import { DatabaseSingleton } from "../core/mongo";
let db = DatabaseSingleton.getConnectRedis();

class UserStatsSchema{};

UserStatsSchema.prototype.name = 'UserStats';


UserStatsSchema.prototype.schema = {
    app         : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp   : { type : Date, required : true},
    currency    : { type : mongoose.Schema.Types.ObjectId, ref: 'Currency', required : true },
    period      : { type : String, required: true},
    userStats   : [{
        _id          : { type : String, required: true},
        name         : { type : String, required: true},
        email        : { type : String, required: true},
        bets         : { type : Number, required: true},
        betAmount    : { type : Number, required: true},
        winAmount    : { type : Number, required: true},
        profit       : { type : Number, required: true},
        playBalance  : { type : Number, required: true}
    }],
}

UserStatsSchema.prototype.model = db.model(UserStatsSchema.prototype.name, new db.Schema(UserStatsSchema.prototype.schema));

export {
    UserStatsSchema
}
