export default class Progress {
    constructor(value, name) {
        this.progress = value;
        this.name     = name;
        this.objProgress = setInterval(()=>{
          console.clear();
          console.log(this.name);
          console.log(`${this.progress} process left`);
        }, 2000);
    }
    setProcess(value) {
        this.progress = value;
    }
    destroyProgress() {
        clearInterval(this.objProgress);
    }
}