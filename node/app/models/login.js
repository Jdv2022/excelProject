

class Login{

    constructor(){
        this.executeQuery = require( '../database/database' )
    }

    async auth(params){
        const log_in = `SELECT * FROM admins WHERE username = ? AND password = ?`

        const values = [params.username, params.password]
        
        const result = await this.executeQuery(log_in, values)

        if(result.length > 0){
            return 'ok'
        }
        else{
            return 'bad'
        }
    }
    
}   

let main = new Login()
module.exports = main


