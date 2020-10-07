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
        let index = -1;

        let countProcess  = await AppSchema.prototype.model.count();
        let processObj    = new Progress(countProcess, type);

        while(true) {
            index++;
            let apps =  await AppSchema.prototype.model
                        .find()
                        .skip(200*index)
                        .limit(200)
                        .select("_id games name");
            if(apps.length === 0){
                break;
            }
            for(let app of apps) {
                processObj.setProcess((--countProcess));
                await functionToProcess(app);
            }
        }
        processObj.destroyProgress();
        processObj = null;
        this.queue[type] = false;
        return true;
    }
}
