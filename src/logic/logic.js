import { AppSchema } from "../schemas/app";
import Progress from "./utils/progress";
export default class Logic {

    constructor(queue){
        this.queue = queue;
    }
    async buildLogicRegisterPerSkip(functionToProcess, type) {
        if(this.queue[type]) {
            return false;
        }
        this.queue[type] = true;
        let index = 1;

        let countProcess  = await AppSchema.prototype.model.count();
        let processObj    = new Progress(countProcess, type);

        while(true) {
            index++;
            let apps =  await AppSchema.prototype.model
                        .find()
                        .skip(1000*index)
                        .sort({_id:-1})
                        .limit(1000)
                        .select("_id");
            if(apps.length === 0){
                break;
            }
            for(let app of apps) {
                processObj.setProcess((--countProcess));
                await functionToProcess(app._id);
            }
        }
        processObj.destroyProgress();
        processObj = null;
        this.queue[type] = false;
        return true;
    }
}
