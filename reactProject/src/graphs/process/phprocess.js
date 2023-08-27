/* process data */
export default function Process(params1, params2, params3){
    let newArrMax = []
    let newArrMid = []
    let newArrMin = []
    let arrNoData = []
    let arrMax = [] 
    let arrMid = []
    let arrMin = []
    let obj = {}
    let noDataArray = []
    const maxUpD = params2.max
    const midMaxD = params2.maxMid
    const midMinD = params2.minMid
    const minD = params2.min
    const cul = params1.features
    const column1 = Object.keys(params3[0])[0]
    const column2 = Object.keys(params3[0])[1]
    const len = params3.length
    for(let i=0; i<len; i++){
        const name = cul[i].properties.ADM2_EN
        const value = cul[i]
        obj[name] = value
    } 
    const lenT = params3.length
    const tableD = params3
    for(let i=0; i<lenT; i++){
        const item = parseInt(tableD[i][column2])
        if((item >= maxUpD) && maxUpD){
            arrMax.push(tableD[i][column1])
        }
        else if(item <= midMaxD && item >= midMinD && midMaxD && midMinD){
            arrMid.push(tableD[i][column1])
        }
        else if(item < midMinD && item >= minD && midMinD && (minD || minD == 0)){
            arrMin.push(tableD[i][column1])
        }
        else{
            arrNoData.push(tableD[i][column1])
        }
    }
    const segragatedData = [arrMax, arrMid, arrMin, arrNoData]
    for(let i=0; i<segragatedData.length; i++){
        for(let j=0; j<segragatedData[i].length; j++){
            const name = segragatedData[i][j]
            if(i==0 && obj[name]){
                newArrMax.push(obj[name])
            }
            else if(i==1 && obj[name]){
                newArrMid.push(obj[name])
            }
            else if(i==2 && obj[name]){
                newArrMin.push(obj[name])
            }
            else if(i==3 && obj[name]){
                noDataArray.push(obj[name])
            }
        }
    }
    const thisDAta = {
        'arrNoData' : arrNoData, 
        'newArrMax' : newArrMax, 
        'newArrMid' : newArrMid, 
        'newArrMin' : newArrMin, 
        'noDataArray' : noDataArray, 
    }
    return thisDAta
}