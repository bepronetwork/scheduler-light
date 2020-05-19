import mongoose from 'mongoose';
import { DatabaseSingleton } from "../core/mongo";
let db = DatabaseSingleton.getConnectRedis();

class PopularNumberSchema{};

PopularNumberSchema.prototype.name = 'PopularNumbers';


PopularNumberSchema.prototype.schema = {
    app                 : { type : mongoose.Schema.Types.ObjectId, ref: 'App', required : true },
    timestamp           : { type : Date, required : true},
    popularNumbers      : [{
        game     : { type: String, required: true},
        numbers  : [{
            key           : { type : String, required: true},
            index         : { type : Number, required: true},
            probability   : { type : Number, required: true},
            resultAmount  : { type : Boolean, required : true}
        }]
    }],
}

PopularNumberSchema.prototype.model = db.model(PopularNumberSchema.prototype.name, new db.Schema(PopularNumberSchema.prototype.schema));

export {
    PopularNumberSchema
}
