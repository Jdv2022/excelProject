

export default function segregateData(data){
    const day = Object.keys(data[0])[1]
    function rec(par){
        for(let i=0; i<par.length; i++){
            if(par[i+1] == undefined){
                return par
            }
            let date1 = new Date(par[i][day])
            let date2 = new Date(par[i+1][day])
            if(date1 <= date2){
                date1 = date2
            }
            else{
                const sub = par[i]
                par[i] = par[i+1]
                par[i+1] = sub
                break
            }
        }
        return rec(par)
    }
    rec(data)
    /* segregate by names */
    let names = []
    const key = Object.keys(data[0])[0]
    for(let i=0; i<data.length; i++){
        if(!names.includes(data[i][key])){
            names.push(data[i][key])
        }
    }
    let arr = []
    for(let i=0; i<names.length; i++){
        let temp = []
        for(let j=0; j<data.length; j++){
            if(names[i] == data[j][key]){
                temp.push(data[j])
            }   
        }
        arr.push(temp)
    }

    return arr

}

export function allDates(data){
    let arr = []
    const key = Object.keys(data[0])[1]
    for(let i=0; i<data.length; i++){
        if(!arr.includes(data[i][key])){
            arr.push(data[i][key])
        }
    }
    return arr
}

export function max(data){
    let temp = 0
    let key = Object.keys(data[0])[2]
    for(let i=0; i<data.length; i++){
        const val =parseInt(data[i][key])
        if(temp < val){
            temp = val
        }
    }
    return temp
}