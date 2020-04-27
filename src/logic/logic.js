import { AppSchema } from "../schemas/app";
export default class Logic {
    async buildLogicRegisterPerSkip(functionToProcess) {
        // let index = -1;
        // while(true) {
        //     index++;
            let apps =  await AppSchema.prototype.model
                        .find()
                        // .skip(1000*index)
                        .sort({_id:-1})
                        .limit(100)
                        .select("_id");
            // if(apps.length === 0){
            //     break;
            // }
            for(let app of apps) {
                await functionToProcess(app._id);
            }
        // }
    }
}
