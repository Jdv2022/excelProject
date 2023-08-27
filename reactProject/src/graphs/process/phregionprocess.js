/* process data */
export default function PhRegionProcess(getGeoData, toolData, tableData){
    let arrNoData = []
    let arrMax = [] 
    let arrMid = []
    let arrMin = []
    let obj = {}
    let arrSegh = []
    let noDataArray = []
    const maxUpD = toolData.max
    const midMaxD = toolData.maxMid
    const midMinD = toolData.minMid
    const minD = toolData.min
    const cul = getGeoData.features
    const column1 = Object.keys(tableData[0])[0]
    const column2 = Object.keys(tableData[0])[1]
    for(const j in tableData){
        const key = tableData[j][column1]
        for(let i=0; i<cul.length; i++){
            const name = cul[i].properties.ADM1_EN
            if(key == name){
                const value = cul[i]
                arrSegh.push(value)
            }
        } 
        obj[key] = arrSegh
        arrSegh = []
    }
    const lenT = tableData.length
    const tableD = tableData
    for(let i=0; i<lenT; i++){
        const item = parseInt(tableD[i][column2])
        const name = tableData[i][column1]
        if((item >= maxUpD) && maxUpD){
            arrMax.push(...obj[name])
        }
        else if(item <= midMaxD && item >= midMinD && midMaxD && midMinD){
            arrMid.push(...obj[name])
        }
        else if(item < midMinD && item >= minD && midMinD && (minD || minD == 0)){
            arrMin.push(...obj[name])
        }
        else{
            arrNoData.push(...obj[name])
        }
    }
    const thisDAta = {
        'arrNoData' : arrNoData, 
        'newArrMax' : arrMax, 
        'newArrMid' : arrMid, 
        'newArrMin' : arrMin, 
        'noDataArray' : noDataArray, 
    }
    return thisDAta
}