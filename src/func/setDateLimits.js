const setDateLimits = () => {

    const date = new Date()
    let minDay = date.getDate() + 1
    let minMonth = date.getMonth() + 1
    let minYear = date.getFullYear()

    let month;
    if (minYear % 4 !== 0) {
        month = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
    } else {
        month = ['31', '29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
    }
    if (minDay > month[minMonth - 1]) {
        minDay = 1
        minMonth += 1 
    }
    if(minMonth > 12){
        minMonth = 1
        minYear += 1
    }
    if (minDay.toString().length == 1) {
        minDay = "0" + minDay.toString()
    }
    if (minMonth.toString().length == 1) {
        minMonth = "0" + minMonth.toString()
    }
    const minDate = `${minYear}-${minMonth}-${minDay}`

    let maxDay = parseInt(minDay) + 30
    let maxMonth = minMonth
    let maxYear = minYear

    if (maxDay > parseInt(month[minMonth - 1])) {
        maxDay = maxDay - parseInt(month[minMonth - 1])
        maxMonth = parseInt(minMonth) + 1
    }
    if (maxMonth > 12) {
        maxMonth = 1
        maxYear += 1
    }

    if (maxDay.toString().length == 1) {
        maxDay = "0" + maxDay.toString()
    }
    if (maxMonth.toString().length == 1) {
        maxMonth = "0" + maxMonth.toString()
    }

    const maxDate = `${maxYear}-${maxMonth}-${maxDay}`
    
    return { minDate, maxDate }
}

export default setDateLimits