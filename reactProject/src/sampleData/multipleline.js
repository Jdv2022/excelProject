export default function multipleline(){

    const data = [
        { name: 'Company A', date: '2020-7-21', value: 100 },
        { name: 'Company B', date: '2020-7-21', value: 50 },
        { name: 'Company C', date: '2020-7-21', value: 0 }
    ]
    
    const newData = [];
    
    for (const company of data) {
        let petsa = company.date
        for (let i = 0; i < 21; i++) {
            const startDate = new Date(petsa)
            let day = startDate.getDate() + 1
            let monthNumber = startDate.getMonth() + 1
            let year = startDate.getFullYear()
    
            // Adjust month and year if the day exceeds the maximum
            if (day > 31) {
                day = 1
                monthNumber += 1
                if (monthNumber > 12) {
                    monthNumber = 1
                    year += 1
                }
            }
    
            const formattedDate = `${year}-${monthNumber}-${day}`
            
            const transactionValue = company.value + Math.round((Math.random() * (20 - -20) + 20))
    
            petsa = formattedDate
            if(i == 0){
                newData.push({
                    name: company.name,
                    date: formattedDate,
                    value: 0
                })
            }
            else{
                newData.push({
                    name: company.name,
                    date: formattedDate,
                    value: (transactionValue < 0)?0:transactionValue
                })
            }
        }
    }
    for(let i=0; i<newData.length; i++){
        const rand = Math.round(Math.random() * (21 - 0) + 21)
        const temp = newData[i]
        newData[i] = newData[rand]
        newData[rand] = temp
    }
    return newData

}