

module.exports = function orderTime(data){

    return segregate(data)

}

function segregate( d ){
    let arr = []
    let time = {
        '00':[],
        '02':[],
        '01':[],
        '03':[],
        '04':[],
        '05':[],
        '06':[],
        '07':[],
        '08':[],
        '09':[],
        '10':[],
        '11':[],
        '12':[],
        '13':[],
        '14':[],
        '15':[],
        '16':[],
        '17':[],
        '18':[],
        '19':[],
        '20':[],
        '21':[],
        '22':[],
        '23':[],
        '24':[]
    }
    for( let i=0; i<d.length; i++ ){
        const h = hours(d[i]['created@']).toString()
        time[h].push(h)
    }   
    for ( const i in time ){
        time[i] = time[i].length
        arr.push({date: i, value: time[i]})
    }
    return arr
}

function hours(t){
    const d = new Date( t )
    let hr = d.getHours()
    if( hr < 10 ){
        hr = '0' + hr
    }
    return hr
}

