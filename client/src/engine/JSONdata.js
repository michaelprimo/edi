export class Agents {
    constructor() {
        this.agent = [];
    }
    
    //we call the function and put the result all in this.logs
    log(agents) {
        this.agent.push(agents);
        
    }

    getLogs() {
        return this.agent;
    }
}