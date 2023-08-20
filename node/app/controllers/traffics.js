let query = require('../models/traffic')
const dym = require('../customLib/dym')
const order = require('../customLib/arrangeTime')

class Traffics {

    async traffic(){
        const trafficdata = await query.GetAll()
        let names = []
        let dates = []
        let date = []
        let obj = {}
        let getmax = []
        let simplifyRes = {}

        const orderTimeResult = order(trafficdata)

        //segregate data
        for( let i=0; i<trafficdata.length; i++ ){
            const dateList = dym( trafficdata[i]['created@'] ) //convert date into %y-%m-%d (location is in customlib folder)
            if( !names.includes( trafficdata[i] ) ){
                names.push( trafficdata[i].name )
            }
            if( !dates.includes( dateList )){
                dates.push( dateList )
                date.push( trafficdata[i]['created@'] )  
            }
        }
        for ( let i = 0; i < trafficdata.length; i++ ) {
            if ( !obj[trafficdata[i].name] ) {
                obj[trafficdata[i].name] = []
            }
            obj[trafficdata[i].name].push({ date: trafficdata[i]['created@'] })
        }

        //get the max value for dates to be used in range d3js
        const keys = Object.keys( obj )
        function peakDates( params, params2 ){
            let simplifyDates = []
            let sub = []
            let c = 0
            let temp = 0
            for( let i = 0; i < params.length; i++ ){
                const dateList = dym( params[i].date )
                if( !sub.includes( dateList ) ){
                    sub.push( dateList )
                    for( let j=i; j<params.length; j++ ){
                        const dateJ = dym( params[j].date )
                        if( dateJ == dateList ){
                            c++
                        }
                    }
                    simplifyDates.push( {date: dateList, amount: c} )
                }
                if( temp < c ){
                    temp = c
                }
                c = 0
            }
            getmax.push(temp)
            simplifyRes[params2] = simplifyDates
        }

        //dates must be in order
        function rec( params ){
            for( let i = 0; i < params.length; i++ ){
                let date1 = new Date( params[i].date )
                let date2 = new Date( params[i+1]?.date )
                if( date1 > date2 ){
                    const sub = params[i]
                    params[i] = params[i+1]
                    params[i+1] = sub
                }
            }
            for( let i = 0; i < params.length; i++ ){
                let date1 = new Date( params[i].date )
                let date2 = new Date( params[i+1]?.date )
                if( date1 > date2 ){
                    break
                }
                else if( params[i+1] == undefined ){
                    return params
                }
            }
            return rec( params )
        }
        for( let i = 0; i < keys.length; i++ ){
            rec( obj[keys[i]] )
            peakDates( obj[keys[i]], keys[i] )
        }
        //get peak traffic 
        let temporary = 0
        for( let i=0; i<getmax.length; i++ ){
            if( temporary < getmax[i] ){
                temporary = getmax[i]
            }
        }
        // output { chartname: amount} & total request
        let simple = {}
        let total = 0
        for( const i in simplifyRes ){
            let sum = 0
            for( let j = 0; j<simplifyRes[i].length; j++ ){
                const add = simplifyRes[i][j].amount
                sum = sum + add
                total = total + add
            }
            simple[i] = sum
        }
        // Send the trafficdata as a JSON response
        const rethis = {
            getAll: orderTimeResult,
            getDates: dates,
            peak: temporary,
            simplifyRes: simplifyRes,
            total: total,
            simple: simple
        }
        return rethis
    }

}
  
let index = new Traffics()
module.exports = index
  