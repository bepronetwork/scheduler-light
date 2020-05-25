// import mongoose from 'mongoose';
import { DatabaseSingleton } from "../core/mongo";
let db = DatabaseSingleton.getConnectMain();

class BalanceWeekSchema{};

BalanceWeekSchema.prototype.name = 'BalanceWeek';

BalanceWeekSchema.prototype.schema =  {
    id          : {  type: String, required : true},
    balance     : {  type: String, required : true},
}


BalanceWeekSchema.prototype.model = db.model(BalanceWeekSchema.prototype.name, new db.Schema(BalanceWeekSchema.prototype.schema));
export {
    BalanceWeekSchema
}
