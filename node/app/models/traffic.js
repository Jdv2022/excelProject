class Traffic{

    constructor(){
        this.executeQuery = require( '../database/database' );
    }

    async GetAll(){
        const log_in = "SELECT * FROM traffic";
        return await this.executeQuery(log_in);
    }
    
}   

let main = new Traffic();
module.exports = main;