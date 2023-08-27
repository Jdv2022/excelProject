let query = require('../models/traffic')
const process = require('../customLib/prodcess')

class Traffics {

    async traffic(req, res){
        const trafficdata = await query.GetAll()
        const result = process(trafficdata)
        res.json(result)
    }

    async sockettraffic(){
        const trafficdata = await query.GetAll()
        const result = process(trafficdata)
        return result
    }

}
  
let index = new Traffics()
module.exports = index
  