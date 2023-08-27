module.exports = function dym(date){
    const d = new Date( date )
    const y = d.getFullYear()
    let m = d.getMonth() + 1
    let day = d.getDate()
    if( day < 10 ){
        day = '0' + day
    }
    if( m < 10 ){
        m = '0' + m
    }
    const dateList = y + '-' + m + '-' + day
    return dateList
}