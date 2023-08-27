export default function segregateData(data){
    const day = Object.keys(data[0])[0]
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
    
    return data

}

