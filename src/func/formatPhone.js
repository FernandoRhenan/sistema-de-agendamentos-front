const formatPhone = (e, phone) => {
    let value = e.target.value
    let lastCharacter = e.target.value.slice(-1).charCodeAt()
    if (lastCharacter >= 48 && lastCharacter <= 57) {
        const valueLength = value.length
        if (valueLength == 1) {
            value = '(' + value
        } else if (valueLength == 3) {
            value += ')'
        } else if (valueLength == 9) {
            value += '-'
        }
    }
    return {value}
}

export default formatPhone